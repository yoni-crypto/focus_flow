import { BottomNav } from './bottom-nav'
import { SidebarNav } from './sidebar-nav'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-black">
      <SidebarNav />
      <div className="flex-1 flex flex-col min-w-0 md:ml-60">
        {children}
        <BottomNav />
        {/* Add padding to prevent content from being hidden behind bottom nav on mobile */}
        <div 
          className="h-16 md:hidden" 
          style={{ 
            height: 'calc(4rem + max(8px, env(safe-area-inset-bottom)))' 
          }}
        />
      </div>
    </div>
  )
}
