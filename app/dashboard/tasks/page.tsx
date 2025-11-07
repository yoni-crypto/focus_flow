import { redirect } from 'next/navigation'
import { getSession } from '@/app/actions/auth'
import { getTasks } from '@/app/actions/tasks'
import { AuthGuard } from '@/components/auth/auth-guard'
import { TasksView } from '@/components/tasks/tasks-view'
import { Container } from '@/components/ui/container'

export default async function TasksPage({
  searchParams,
}: {
  searchParams: { date?: string }
}) {
  const session = await getSession()

  if (!session) {
    redirect('/auth/login')
  }

  const selectedDate = searchParams.date || new Date().toISOString().split('T')[0]
  const { data: initialTasks } = await getTasks(selectedDate)

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <div className="border-b border-border">
          <Container>
            <div className="py-4">
              <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Manage your daily tasks
              </p>
            </div>
          </Container>
        </div>

        <Container className="py-6">
          <TasksView initialTasks={initialTasks || []} initialDate={selectedDate} />
        </Container>
      </div>
    </AuthGuard>
  )
}

