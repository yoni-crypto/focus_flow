import { redirect } from 'next/navigation'
import { getSession, signOut } from '@/app/actions/auth'
import { AuthGuard } from '@/components/auth/auth-guard'
import { Button } from '@/components/ui/button'
import { TodayTasks } from '@/components/dashboard/today-tasks'
import { SavingsSummary } from '@/components/dashboard/savings-summary'
import { FocusStats } from '@/components/dashboard/focus-stats'
import { PinnedNotes } from '@/components/dashboard/pinned-notes'
import { Container } from '@/components/ui/container'

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <div className="border-b border-border">
          <Container>
            <div className="flex items-center justify-between py-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Welcome back, {session.user.email?.split('@')[0]}
                </p>
              </div>
              <form action={signOut}>
                <Button type="submit" variant="outline" size="sm">
                  Sign out
                </Button>
              </form>
            </div>
          </Container>
        </div>

        <Container className="py-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="md:col-span-2">
              <TodayTasks />
            </div>
            <div>
              <FocusStats />
            </div>
            <div>
              <SavingsSummary />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <PinnedNotes />
            </div>
          </div>
        </Container>
      </div>
    </AuthGuard>
  )
}

