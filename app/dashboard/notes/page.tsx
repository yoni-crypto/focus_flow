import { redirect } from 'next/navigation'
import { getSession } from '@/app/actions/auth'
import { getNotes } from '@/app/actions/notes'
import { AuthGuard } from '@/components/auth/auth-guard'
import { NotesView } from '@/components/notes/notes-view'

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ archived?: string; search?: string }>
}) {
  const session = await getSession()

  if (!session) {
    redirect('/auth/login')
  }

  const params = await searchParams
  const showArchived = params.archived === 'true'
  const searchQuery = params.search || ''

  const { data: notes } = showArchived
    ? await getNotes(true)
    : searchQuery
    ? await getNotes(false) // We'll filter by search in the component
    : await getNotes(false)

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black">
        {/* Clean Header */}
        <div className="border-b border-gray-800/50 bg-black sticky top-0 z-10">
          <div className="px-6 py-5">
            <div className="flex items-center h-full">
              <div>
                <h1 className="text-lg font-semibold text-white leading-none">Notes</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6 pb-24 md:pb-8">
          <NotesView
            initialNotes={notes || []}
            initialArchived={showArchived}
            initialSearch={searchQuery}
          />
        </div>
      </div>
    </AuthGuard>
  )
}
