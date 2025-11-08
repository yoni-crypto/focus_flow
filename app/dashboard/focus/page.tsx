import { redirect } from 'next/navigation'
import { getSession } from '@/app/actions/auth'
import { AuthGuard } from '@/components/auth/auth-guard'
import { FocusTimer } from '@/components/focus/focus-timer'
import { FocusHistory } from '@/components/focus/focus-history'

export default async function FocusPage() {
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
                <h1 className="text-lg font-semibold text-white leading-none">Focus Timer</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pb-24 md:pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            <div className="lg:col-span-2">
              <FocusTimer />
            </div>
            <div>
              <FocusHistory />
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
