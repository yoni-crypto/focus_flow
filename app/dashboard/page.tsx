import { redirect } from 'next/navigation'
import { getSession } from '@/app/actions/auth'
import { AuthGuard } from '@/components/auth/auth-guard'
import { TodayTasks } from '@/components/dashboard/today-tasks'
import { SavingsSummary } from '@/components/dashboard/savings-summary'
import { FocusStats } from '@/components/dashboard/focus-stats'
import { PinnedNotes } from '@/components/dashboard/pinned-notes'

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black">
        <div className="border-b border-gray-800/50 bg-black sticky top-0 z-10">
          <div className="px-6 py-5">
            <div className="flex items-center h-full">
              <div>
                <h1 className="text-lg font-semibold text-white leading-none">Dashboard</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <TodayTasks />
              <PinnedNotes />
            </div>
            
            <div className="lg:col-span-1 space-y-4">
              <FocusStats />
              <SavingsSummary />
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
