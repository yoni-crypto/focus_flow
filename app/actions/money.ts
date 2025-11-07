'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Database } from '@/lib/supabase/types'

type MoneyEntry = Database['public']['Tables']['money_entries']['Row']
type MoneyEntryInsert = Database['public']['Tables']['money_entries']['Insert']
type MoneyEntryUpdate = Database['public']['Tables']['money_entries']['Update']

export async function getMoneyEntries(date?: string, month?: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: 'Not authenticated' }
  }

  let query = supabase
    .from('money_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  if (date) {
    query = query.eq('date', date)
  } else if (month) {
    // Calculate the first day of the month and first day of next month for proper filtering
    const startDate = `${month}-01`
    // Get the next month for end date
    const [year, monthNum] = month.split('-').map(Number)
    const nextMonth = monthNum === 12 ? `${year + 1}-01` : `${year}-${String(monthNum + 1).padStart(2, '0')}`
    const endDate = `${nextMonth}-01`
    query = query.gte('date', startDate).lt('date', endDate)
  }

  const { data, error } = await query

  if (error) {
    return { data: null, error: error.message }
  }

  return { data: data as MoneyEntry[], error: null }
}

export async function createMoneyEntry(entry: Omit<MoneyEntryInsert, 'user_id'>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('money_entries')
    .insert({
      ...entry,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  revalidatePath('/dashboard/money')
  return { data: data as MoneyEntry, error: null }
}

export async function updateMoneyEntry(id: string, updates: MoneyEntryUpdate) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('money_entries')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  revalidatePath('/dashboard/money')
  return { data: data as MoneyEntry, error: null }
}

export async function deleteMoneyEntry(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('money_entries')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/money')
  return { error: null }
}

export async function getMoneyStats(month?: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: 'Not authenticated' }
  }

  const targetMonth = month || new Date().toISOString().slice(0, 7)

  // Calculate the first day of the month and first day of next month for proper filtering
  const startDate = `${targetMonth}-01`
  const [year, monthNum] = targetMonth.split('-').map(Number)
  const nextMonth = monthNum === 12 ? `${year + 1}-01` : `${year}-${String(monthNum + 1).padStart(2, '0')}`
  const endDate = `${nextMonth}-01`

  const { data: entries } = await supabase
    .from('money_entries')
    .select('type, amount, date')
    .eq('user_id', user.id)
    .gte('date', startDate)
    .lt('date', endDate)

  if (!entries) {
    return {
      data: {
        totalSpent: 0,
        totalSaved: 0,
        net: 0,
      },
      error: null,
    }
  }

  const totalSpent = entries
    .filter((e) => e.type === 'spend')
    .reduce((sum, e) => sum + Number(e.amount), 0)

  const totalSaved = entries
    .filter((e) => e.type === 'save')
    .reduce((sum, e) => sum + Number(e.amount), 0)

  return {
    data: {
      totalSpent,
      totalSaved,
      net: totalSaved - totalSpent,
    },
    error: null,
  }
}

