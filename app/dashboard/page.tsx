import { redirect } from 'next/navigation'
import { getSession } from '@/app/actions/auth'
import { AuthGuard } from '@/components/auth/auth-guard'
import { signOut } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <AuthGuard>
      <div className="min-h-screen p-4">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Welcome back, {session.user.email}
              </p>
            </div>
            <form action={signOut}>
              <Button type="submit" variant="outline">
                Sign out
              </Button>
            </form>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold">Tasks</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Manage your daily tasks
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold">Focus Timer</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Track your focus sessions
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold">Budget</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Track spending and savings
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

