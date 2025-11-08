import { redirect } from 'next/navigation'
import { getSession } from '@/app/actions/auth'
import { getTasks } from '@/app/actions/tasks'
import { AuthGuard } from '@/components/auth/auth-guard'
import { TasksView } from '@/components/tasks/tasks-view'

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const session = await getSession()

  if (!session) {
    redirect('/auth/login')
  }

  const params = await searchParams
  const selectedDate = params.date || new Date().toISOString().split('T')[0]
  const { data: initialTasks } = await getTasks(selectedDate)

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black">
        <div className="border-b border-gray-800/50 bg-black sticky top-0 z-10">
          <div className="px-6 py-5">
            <div className="flex items-center h-full">
              <div>
                <h1 className="text-lg font-semibold text-white leading-none">Tasks</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6 pb-24 md:pb-6">
          <TasksView initialTasks={initialTasks || []} initialDate={selectedDate} />
        </div>
      </div>
    </AuthGuard>
  )
}
