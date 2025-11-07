import { redirect } from 'next/navigation'
import { getSession } from '@/app/actions/auth'
import { getNotes } from '@/app/actions/notes'
import { AuthGuard } from '@/components/auth/auth-guard'
import { NotesView } from '@/components/notes/notes-view'
import { Container } from '@/components/ui/container'

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
      <div className="min-h-screen bg-background">
        <div className="border-b border-border">
          <Container>
            <div className="py-4">
              <h1 className="text-2xl font-semibold tracking-tight">Notes</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Quick notes and ideas
              </p>
            </div>
          </Container>
        </div>

        <Container className="py-6 pb-24 md:pb-6">
          <NotesView
            initialNotes={notes || []}
            initialArchived={showArchived}
            initialSearch={searchQuery}
          />
        </Container>
      </div>
    </AuthGuard>
  )
}

