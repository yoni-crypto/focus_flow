import { redirect } from 'next/navigation'
import { getSession } from '@/app/actions/auth'
import { LoginForm } from '@/components/auth/login-form'

interface LoginPageProps {
  searchParams: Promise<{ registered?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getSession()
  
  if (session) {
    redirect('/dashboard')
  }

  const params = await searchParams
  const registered = params.registered === 'true'

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your FocusFlow account
          </p>
        </div>
        {registered && (
          <div className="rounded-lg border border-border bg-muted/50 p-4 text-center">
            <p className="text-sm text-foreground">
              Account created! Please check your email to verify your account, then sign in.
            </p>
          </div>
        )}
        <LoginForm />
      </div>
    </div>
  )
}

