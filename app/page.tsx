import { redirect } from 'next/navigation'
import { getSession } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function HomePage() {
  const session = await getSession()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">FocusFlow</h1>
          <p className="text-muted-foreground">
            A premium, minimal productivity and finance tracker
          </p>
        </div>
        
        <div className="space-y-4">
          <Link href="/auth/login">
            <Button className="w-full" size="lg">
              Sign in
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button variant="outline" className="w-full" size="lg">
              Create account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
