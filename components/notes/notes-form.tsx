'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
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
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            required
            disabled={loading}
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Note content"
            required
            disabled={loading}
            rows={6}
            className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="pinned"
            checked={pinned}
            onChange={(e) => setPinned(e.target.checked)}
            disabled={loading}
            className="h-4 w-4 rounded border-input"
          />
          <Label htmlFor="pinned" className="text-sm font-normal cursor-pointer">
            Pin note
          </Label>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Saving...' : note ? 'Update Note' : 'Create Note'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}

