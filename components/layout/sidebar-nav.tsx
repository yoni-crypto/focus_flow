'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, CheckSquare, Timer, Wallet, StickyNote, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { signOut } from '@/app/actions/auth'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/dashboard/focus', label: 'Focus', icon: Timer },
  { href: '/dashboard/money', label: 'Money', icon: Wallet },
  { href: '/dashboard/notes', label: 'Notes', icon: StickyNote },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex md:fixed md:left-0 md:top-0 md:h-screen md:w-60 md:flex-col bg-black border-r border-gray-800/50 z-40">
      <div className="flex flex-1 flex-col h-full">
        {/* Clean Logo Section */}
        <div className="px-6 py-5 flex items-center justify-center  border-gray-800/50">
          <div className="flex items-center h-full">
            <Link href="/dashboard">
              <span className="text-lg font-semibold text-white leading-none">Focus Flow</span>
            </Link>
          </div>
        </div>

        {/* Navigation - Natural Styling */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname === item.href || pathname.startsWith(item.href + '/')
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 relative',
                  'text-sm font-medium transition-colors duration-200',
                  isActive
                    ? 'text-white'
                    : 'text-gray-400 hover:text-gray-200'
                )}
              >
                {/* Active indicator - left border */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white" />
                )}
                
                <Icon 
                  className={cn(
                    'h-4 w-4 shrink-0 transition-colors duration-200',
                    isActive ? 'text-white' : 'text-gray-500'
                  )} 
                  strokeWidth={2}
                />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Sign Out - Natural Bottom */}
        <div className="border-t border-gray-800/50 px-3 py-4">
          <form action={signOut}>
            <Button
              type="submit"
              variant="ghost"
              className={cn(
                'w-full justify-start text-gray-400 hover:text-gray-200',
                'px-3 py-2.5 h-auto rounded-none',
                'hover:bg-transparent transition-colors duration-200'
              )}
            >
              <LogOut className="h-4 w-4 mr-3 shrink-0 text-gray-500" strokeWidth={2} />
              <span className="text-sm font-medium">Sign out</span>
            </Button>
          </form>
        </div>
      </div>
    </aside>
  )
}
