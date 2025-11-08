'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pin, PinOff, Archive, ArchiveRestore, Trash2, Edit2 } from 'lucide-react'
import { BackgroundImage } from '@/components/ui/background-image'
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
        'relative group hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden',
        'bg-gray-900/30 border-gray-800/50 backdrop-blur-sm',
        isPinned && 'border-yellow-500/50'
      )}
      onClick={onEdit}
    >
      <BackgroundImage src="/images/notes-bg.jpg" alt="Notes background" opacity={15} />
      
      <CardContent className="p-4 relative z-10">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm line-clamp-2 flex-1 text-white">{note.title}</h3>
            {isPinned && <Pin className="h-4 w-4 text-yellow-400 shrink-0" fill="currentColor" />}
          </div>
          <p className="text-sm text-gray-300 line-clamp-4">{note.content}</p>
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-gray-400">
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
                className="h-7 w-7 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10"
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
                className="h-7 w-7 text-gray-400 hover:text-white hover:bg-gray-900/50"
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
                className="h-7 w-7 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
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
