'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Database } from '@/lib/supabase/types'

type Note = Database['public']['Tables']['notes']['Row']
type NoteInsert = Database['public']['Tables']['notes']['Insert']
type NoteUpdate = Database['public']['Tables']['notes']['Update']

export async function getNotes(archived: boolean = false) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', user.id)
    .eq('archived', archived)
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    return { data: null, error: error.message }
  }

  return { data: data as Note[], error: null }
}

export async function getPinnedNotes() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', user.id)
    .eq('pinned', true)
    .eq('archived', false)
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) {
    return { data: null, error: error.message }
  }

  return { data: data as Note[], error: null }
}

export async function searchNotes(query: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', user.id)
    .eq('archived', false)
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    return { data: null, error: error.message }
  }

  return { data: data as Note[], error: null }
}

export async function createNote(note: Omit<NoteInsert, 'user_id'>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('notes')
    .insert({
      ...note,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  revalidatePath('/dashboard')
  return { data: data as Note, error: null }
}

export async function updateNote(id: string, updates: NoteUpdate) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('notes')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  revalidatePath('/dashboard')
  return { data: data as Note, error: null }
}

export async function deleteNote(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { error: null }
}

