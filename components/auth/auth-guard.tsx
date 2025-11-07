import { redirect } from 'next/navigation'
import { getSession } from '@/app/actions/auth'

interface AuthGuardProps {
  children: React.ReactNode
}

export async function AuthGuard({ children }: AuthGuardProps) {
  const session = await getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return <>{children}</>
}

