'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createNote, updateNote, deleteNote, searchNotes } from '@/app/actions/notes'
import { NotesGrid } from './notes-grid'
import { NotesForm } from './notes-form'
import { NotesSearch } from './notes-search'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import type { Database } from '@/lib/supabase/types'

type Note = Database['public']['Tables']['notes']['Row']

interface NotesViewProps {
  initialNotes: Note[]
  initialArchived: boolean
  initialSearch: string
}

export function NotesView({
  initialNotes,
  initialArchived,
  initialSearch,
}: NotesViewProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [showArchived, setShowArchived] = useState(initialArchived)
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [showForm, setShowForm] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)

  useEffect(() => {
    setNotes(initialNotes)
    setShowArchived(initialArchived)
    setSearchQuery(initialSearch)
  }, [initialNotes, initialArchived, initialSearch])

  // Filter notes based on search and archived status
  const filteredNotes = useMemo(() => {
    let filtered = notes

    if (searchQuery) {
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }, [notes, searchQuery])

  async function handleSearch(query: string) {
    setSearchQuery(query)
    if (query) {
      router.push(`${pathname}?search=${encodeURIComponent(query)}`)
      router.refresh()
    } else {
      router.push(pathname)
      router.refresh()
    }
  }

  function toggleArchived() {
    const newArchived = !showArchived
    setShowArchived(newArchived)
    router.push(`${pathname}?archived=${newArchived}`)
    router.refresh()
  }

  async function handleCreateNote(note: {
    title: string
    content: string
    pinned?: boolean
  }) {
    const { data, error } = await createNote({
      ...note,
      archived: false,
    })

    if (error) {
      console.error('Error creating note:', error)
      return { error }
    }

    if (data) {
      setNotes([data, ...notes])
      setShowForm(false)
      router.refresh()
    }

    return { error: null }
  }

  async function handleUpdateNote(id: string, updates: Partial<Note>) {
    const { data, error } = await updateNote(id, updates)

    if (error) {
      console.error('Error updating note:', error)
      return { error }
    }

    if (data) {
      setNotes(notes.map((n) => (n.id === id ? data : n)))
      setEditingNote(null)
      router.refresh()
    }

    return { error: null }
  }

  async function handleDeleteNote(id: string) {
    const { error } = await deleteNote(id)

    if (error) {
      console.error('Error deleting note:', error)
      return { error }
    }

    setNotes(notes.filter((n) => n.id !== id))
    router.refresh()

    return { error: null }
  }

  function handleEdit(note: Note) {
    setEditingNote(note)
    setShowForm(true)
  }

  function handleCancel() {
    setShowForm(false)
    setEditingNote(null)
  }

  const pinnedNotes = filteredNotes.filter((n) => n.pinned && !n.archived)
  const unpinnedNotes = filteredNotes.filter((n) => !n.pinned && !n.archived)
  const archivedNotesList = showArchived ? filteredNotes.filter((n) => n.archived) : []

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Button
            variant={showArchived ? 'default' : 'outline'}
            size="sm"
            onClick={toggleArchived}
          >
            {showArchived ? 'Active Notes' : 'Archived Notes'}
          </Button>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </div>

      {!showArchived && <NotesSearch onSearch={handleSearch} initialQuery={searchQuery} />}

      {showForm && (
        <NotesForm
          note={editingNote || undefined}
          onSubmit={editingNote ? (data) => handleUpdateNote(editingNote.id, data) : handleCreateNote}
          onCancel={handleCancel}
        />
      )}

      {showArchived ? (
        <NotesGrid
          notes={archivedNotesList}
          onEdit={handleEdit}
          onDelete={handleDeleteNote}
          onTogglePin={(id, pinned) => handleUpdateNote(id, { pinned })}
          onToggleArchive={(id, archived) => handleUpdateNote(id, { archived })}
        />
      ) : (
        <>
          {pinnedNotes.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Pinned</h2>
              <NotesGrid
                notes={pinnedNotes}
                onEdit={handleEdit}
                onDelete={handleDeleteNote}
                onTogglePin={(id, pinned) => handleUpdateNote(id, { pinned })}
                onToggleArchive={(id, archived) => handleUpdateNote(id, { archived })}
              />
            </div>
          )}
          {unpinnedNotes.length > 0 && (
            <div className="space-y-4">
              {pinnedNotes.length > 0 && <h2 className="text-lg font-semibold">All Notes</h2>}
              <NotesGrid
                notes={unpinnedNotes}
                onEdit={handleEdit}
                onDelete={handleDeleteNote}
                onTogglePin={(id, pinned) => handleUpdateNote(id, { pinned })}
                onToggleArchive={(id, archived) => handleUpdateNote(id, { archived })}
              />
            </div>
          )}
          {filteredNotes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'No notes found' : 'No notes yet'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

