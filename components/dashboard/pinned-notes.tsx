import { getPinnedNotes } from '@/app/actions/notes'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Pin } from 'lucide-react'

export async function PinnedNotes() {
  const { data: notes, error } = await getPinnedNotes()

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pinned Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Error loading notes</p>
        </CardContent>
      </Card>
    )
  }

  if (!notes || notes.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Pinned Notes</CardTitle>
          <Link
            href="/dashboard/notes"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No pinned notes</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Pinned Notes</CardTitle>
        <Link
          href="/dashboard/notes"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {notes.map((note) => (
            <Link
              key={note.id}
              href={`/dashboard/notes/${note.id}`}
              className="block rounded-lg border border-border p-3 hover:bg-accent transition-colors"
            >
              <div className="flex items-start gap-2">
                <Pin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{note.title}</p>
                  {note.content && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {note.content}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

