import { redirect } from 'next/navigation'
import { getSession } from '@/app/actions/auth'
import { AuthGuard } from '@/components/auth/auth-guard'
import { FocusTimer } from '@/components/focus/focus-timer'
import { FocusHistory } from '@/components/focus/focus-history'
import { Container } from '@/components/ui/container'

export default async function FocusPage() {
  const session = await getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <div className="border-b border-border">
          <Container>
            <div className="py-4">
              <h1 className="text-2xl font-semibold tracking-tight">Focus Timer</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Pomodoro timer for focused work sessions
              </p>
            </div>
          </Container>
        </div>

        <Container className="py-6 pb-24 md:pb-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <FocusTimer />
            </div>
            <div>
              <FocusHistory />
            </div>
          </div>
        </Container>
      </div>
    </AuthGuard>
  )
}

