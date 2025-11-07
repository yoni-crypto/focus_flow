'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pin, PinOff, Archive, ArchiveRestore, Trash2, Edit2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Database } from '@/lib/supabase/types'

type Note = Database['public']['Tables']['notes']['Row']

interface NoteCardProps {
  note: Note
  onEdit: () => void
  onDelete: () => Promise<{ error: string | null }>
  onTogglePin: (pinned: boolean) => Promise<{ error: string | null }>
  onToggleArchive: (archived: boolean) => Promise<{ error: string | null }>
}

export function NoteCard({
  note,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleArchive,
}: NoteCardProps) {
  const isPinned = note.pinned
  const isArchived = note.archived

  return (
    <Card
      className={cn(
        'relative group hover:shadow-sm transition-shadow cursor-pointer',
        isPinned && 'border-primary'
      )}
      onClick={onEdit}
    >
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm line-clamp-2 flex-1">{note.title}</h3>
            {isPinned && <Pin className="h-4 w-4 text-primary shrink-0" />}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-4">{note.content}</p>
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">
              {new Date(note.updated_at || note.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <div
              className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onTogglePin(!isPinned)}
                title={isPinned ? 'Unpin' : 'Pin'}
              >
                {isPinned ? (
                  <PinOff className="h-3.5 w-3.5" />
                ) : (
                  <Pin className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onToggleArchive(!isArchived)}
                title={isArchived ? 'Unarchive' : 'Archive'}
              >
                {isArchived ? (
                  <ArchiveRestore className="h-3.5 w-3.5" />
                ) : (
                  <Archive className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={onDelete}
                title="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

