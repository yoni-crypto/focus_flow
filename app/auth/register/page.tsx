import { redirect } from 'next/navigation'
import { getSession } from '@/app/actions/auth'
import { RegisterForm } from '@/components/auth/register-form'

export default async function RegisterPage() {
  const session = await getSession()
  
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Create account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Get started with FocusFlow
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}

