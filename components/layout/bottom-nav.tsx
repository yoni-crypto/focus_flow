'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, CheckSquare, Timer, Wallet, StickyNote } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/dashboard/focus', label: 'Focus', icon: Timer },
  { href: '/dashboard/money', label: 'Money', icon: Wallet },
  { href: '/dashboard/notes', label: 'Notes', icon: StickyNote },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-900 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80 md:hidden">
      <div 
        className="flex h-16 items-center justify-around"
        style={{ 
          paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon
          // Special handling for Dashboard - only active on exact match
          // Other pages - active on exact match or sub-routes
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname === item.href || pathname.startsWith(item.href + '/')
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 h-full',
                'transition-colors duration-200',
                isActive
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-300'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
