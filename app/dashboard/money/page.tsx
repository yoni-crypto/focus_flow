import { redirect } from 'next/navigation'
import { getSession } from '@/app/actions/auth'
import { getMoneyEntries, getMoneyStats } from '@/app/actions/money'
import { AuthGuard } from '@/components/auth/auth-guard'
import { MoneyTracker } from '@/components/money/money-tracker'

export default async function MoneyPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>
}) {
  const session = await getSession()

  if (!session) {
    redirect('/auth/login')
  }

  const params = await searchParams
  const month = params.month || new Date().toISOString().slice(0, 7)
  const { data: entries } = await getMoneyEntries(undefined, month)
  const { data: stats } = await getMoneyStats(month)

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black">
        <div className="border-b border-gray-800/50 bg-black sticky top-0 z-10">
          <div className="px-6 py-5">
            <div className="flex items-center h-full">
              <div>
                <h1 className="text-lg font-semibold text-white leading-none">Money Tracker</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6 pb-24 md:pb-8">
          <MoneyTracker
            initialEntries={entries || []}
            initialStats={stats || { totalSpent: 0, totalSaved: 0, net: 0 }}
            initialMonth={month}
          />
        </div>
      </div>
    </AuthGuard>
  )
}
