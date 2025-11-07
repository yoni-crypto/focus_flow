import { redirect } from 'next/navigation'
import { getSession } from '@/app/actions/auth'
import { getMoneyEntries, getMoneyStats } from '@/app/actions/money'
import { AuthGuard } from '@/components/auth/auth-guard'
import { MoneyTracker } from '@/components/money/money-tracker'
import { Container } from '@/components/ui/container'

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
      <div className="min-h-screen bg-background">
        <div className="border-b border-border">
          <Container>
            <div className="py-4">
              <h1 className="text-2xl font-semibold tracking-tight">Money Tracker</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Track your spending and savings
              </p>
            </div>
          </Container>
        </div>

        <Container className="py-6 pb-24 md:pb-6">
          <MoneyTracker
            initialEntries={entries || []}
            initialStats={stats || { totalSpent: 0, totalSaved: 0, net: 0 }}
            initialMonth={month}
          />
        </Container>
      </div>
    </AuthGuard>
  )
}

