import { getPinnedNotes } from '@/app/actions/notes'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Pin } from 'lucide-react'
import { BackgroundImage } from '@/components/ui/background-image'

export async function PinnedNotes() {
  const { data: notes, error } = await getPinnedNotes()

  if (error) {
    return (
      <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Pinned Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400">Error loading notes</p>
        </CardContent>
      </Card>
    )
  }

  if (!notes || notes.length === 0) {
    return (
      <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-sm relative overflow-hidden">
        <BackgroundImage src="/images/notes-bg.jpg" alt="Notes background" opacity={20} />
        <div className="relative z-10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold text-white">Pinned Notes</CardTitle>
            <Link
              href="/dashboard/notes"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">No pinned notes</p>
          </CardContent>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900/30 border-gray-800/50 backdrop-blur-sm relative overflow-hidden">
      {/* Background Image */}
      <BackgroundImage src="/images/notes-bg.jpg" alt="Notes background" opacity={20} />
      
      <div className="relative z-10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold text-white">Pinned Notes</CardTitle>
          <Link
            href="/dashboard/notes"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {notes.map((note) => (
              <Link
                key={note.id}
                href="/dashboard/notes"
                className="block rounded-lg border border-gray-800/50 bg-gray-900/20 p-4 hover:bg-gray-900/40 hover:border-gray-700/50 transition-all duration-200 group"
              >
                <div className="flex items-start gap-3">
                  <Pin className="h-4 w-4 text-gray-500 mt-0.5 shrink-0 group-hover:text-yellow-500 transition-colors" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{note.title}</p>
                    {note.content && (
                      <p className="text-xs text-gray-400 line-clamp-2 mt-1.5">
                        {note.content}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
