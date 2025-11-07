'use client'

import { NoteCard } from './note-card'
import type { Database } from '@/lib/supabase/types'

type Note = Database['public']['Tables']['notes']['Row']

interface NotesGridProps {
  notes: Note[]
  onEdit: (note: Note) => void
  onDelete: (id: string) => Promise<{ error: string | null }>
  onTogglePin: (id: string, pinned: boolean) => Promise<{ error: string | null }>
  onToggleArchive: (id: string, archived: boolean) => Promise<{ error: string | null }>
}

export function NotesGrid({
  notes,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleArchive,
}: NotesGridProps) {
  if (notes.length === 0) {
    return null
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onEdit={() => onEdit(note)}
          onDelete={() => onDelete(note.id)}
          onTogglePin={(pinned) => onTogglePin(note.id, pinned)}
          onToggleArchive={(archived) => onToggleArchive(note.id, archived)}
        />
      ))}
    </div>
  )
}

