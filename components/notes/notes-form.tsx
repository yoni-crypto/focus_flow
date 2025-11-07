'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Database } from '@/lib/supabase/types'

type Note = Database['public']['Tables']['notes']['Row']

interface NotesFormProps {
  note?: Note
  onSubmit: (note: {
    title: string
    content: string
    pinned?: boolean
    archived?: boolean
  }) => Promise<{ error: string | null }>
  onCancel: () => void
}

export function NotesForm({ note, onSubmit, onCancel }: NotesFormProps) {
  const [title, setTitle] = useState(note?.title || '')
  const [content, setContent] = useState(note?.content || '')
  const [pinned, setPinned] = useState(note?.pinned || false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    if (!content.trim()) {
      setError('Content is required')
      return
    }

    setLoading(true)

    const result = await onSubmit({
      title: title.trim(),
      content: content.trim(),
      pinned,
      archived: note?.archived || false,
    })

    if (result.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-white text-sm font-medium">
          Title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          required
          disabled={loading}
          autoFocus
          className="bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-500 focus:border-gray-700 focus:ring-gray-700 h-10 rounded-lg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content" className="text-white text-sm font-medium">
          Content
        </Label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Note content"
          required
          disabled={loading}
          rows={8}
          className="flex min-h-[120px] w-full rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-2 text-sm text-white placeholder:text-gray-500 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:border-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="pinned"
          checked={pinned}
          onChange={(e) => setPinned(e.target.checked)}
          disabled={loading}
          className="h-4 w-4 rounded border-gray-800 bg-gray-900/50 text-yellow-400 focus:ring-yellow-400 focus:ring-offset-gray-900"
        />
        <Label htmlFor="pinned" className="text-sm font-normal cursor-pointer text-gray-300">
          Pin note
        </Label>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <Button 
          type="submit" 
          disabled={loading} 
          className="flex-1 bg-gray-200 text-black hover:bg-gray-300 h-10 rounded-lg"
        >
          {loading ? 'Saving...' : note ? 'Update Note' : 'Create Note'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          disabled={loading}
          className="bg-gray-900/50 border-gray-800 text-white hover:bg-gray-900 hover:border-gray-700 h-10 rounded-lg"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
