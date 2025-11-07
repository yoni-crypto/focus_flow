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
    <div className="min-h-screen bg-black flex items-center">
      <div className="w-full">
        {/* Hero Section */}
        <div className="relative min-h-screen flex items-center justify-center">
          {/* Background Image */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'url(/hero-bg.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className="absolute inset-0 bg-black/80" />
          </div>

          {/* Content */}
          <div className="relative z-10 w-full max-w-5xl mx-auto px-6 lg:px-8">
            <div className="text-center space-y-10">
              {/* Brand */}
              <div className="space-y-6">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight">
                  Focus Flow
                </h1>
                <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light">
                  Productivity, finance, and focus unified in one minimal interface.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center gap-4 pt-4">
                <Link href="/auth/register">
                  <Button 
                    size="lg" 
                    className="bg-white text-black hover:bg-gray-100 h-12 px-8 text-base font-medium rounded-lg"
                  >
                    Get started
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button 
                    variant="ghost" 
                    size="lg"
                    className="text-gray-300 hover:text-white hover:bg-white/5 h-12 px-8 text-base font-medium"
                  >
                    Sign in
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
