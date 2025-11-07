'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Database } from '@/lib/supabase/types'

type FocusSession = Database['public']['Tables']['focus_sessions']['Row']
type FocusSessionInsert = Database['public']['Tables']['focus_sessions']['Insert']
type FocusSessionUpdate = Database['public']['Tables']['focus_sessions']['Update']

export async function getFocusSessions(limit?: number) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: 'Not authenticated' }
  }

  let query = supabase
    .from('focus_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    return { data: null, error: error.message }
  }

  return { data: data as FocusSession[], error: null }
}

export async function createFocusSession(session: Omit<FocusSessionInsert, 'user_id'>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('focus_sessions')
    .insert({
      ...session,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  revalidatePath('/dashboard')
  return { data: data as FocusSession, error: null }
}

export async function updateFocusSession(id: string, updates: FocusSessionUpdate) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('focus_sessions')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  revalidatePath('/dashboard')
  return { data: data as FocusSession, error: null }
}

export async function getFocusStats() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: 'Not authenticated' }
  }

  // Get total sessions count
  const { count: totalSessions } = await supabase
    .from('focus_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .not('duration_minutes', 'is', null)

  // Get today's sessions
  const today = new Date().toISOString().split('T')[0]
  const { count: todaySessions } = await supabase
    .from('focus_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', today)
    .not('duration_minutes', 'is', null)

  // Get total minutes
  const { data: sessions } = await supabase
    .from('focus_sessions')
    .select('duration_minutes')
    .eq('user_id', user.id)
    .not('duration_minutes', 'is', null)

  const totalMinutes = sessions?.reduce((acc, session) => acc + (session.duration_minutes || 0), 0) || 0

  // Calculate streak (consecutive days with at least one session)
  const { data: allSessions } = await supabase
    .from('focus_sessions')
    .select('created_at')
    .eq('user_id', user.id)
    .not('duration_minutes', 'is', null)
    .order('created_at', { ascending: false })

  let streak = 0
  if (allSessions && allSessions.length > 0) {
    const uniqueDays = new Set(
      allSessions.map((s) => new Date(s.created_at).toISOString().split('T')[0])
    )
    const sortedDays = Array.from(uniqueDays).sort().reverse()
    
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    
    for (const day of sortedDays) {
      const sessionDate = new Date(day)
      sessionDate.setHours(0, 0, 0, 0)
      const diffDays = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays === streak) {
        streak++
      } else {
        break
      }
    }
  }

  return {
    data: {
      totalSessions: totalSessions || 0,
      todaySessions: todaySessions || 0,
      totalMinutes,
      streak,
    },
    error: null,
  }
}

