'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useDashboardStore } from '@/store'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  GitBranch,
  Building2,
  BarChart3,
  Users,
  CalendarDays,
  Cog,
  BookOpen,
  FolderOpen,
  X,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Pipeline', href: '/pipeline', icon: GitBranch },
  { name: 'Brands', href: '/brands', icon: Building2 },
  { name: 'Metrics', href: '/metrics', icon: BarChart3 },
  { name: 'Visionaries', href: '/visionaries', icon: Users },
  { name: 'Weekly Plan', href: '/weekly', icon: CalendarDays },
]

const secondaryNav = [
  { name: 'Playbooks', href: '/playbooks', icon: BookOpen },
  { name: 'Resources', href: '/resources', icon: FolderOpen },
  { name: 'Settings', href: '/settings', icon: Cog },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar } = useDashboardStore()

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-200 dark:border-gray-800 dark:bg-gray-900 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Mobile close button */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800 lg:hidden">
          <span className="font-semibold text-gray-900 dark:text-white">
            Navigation
          </span>
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </div>

          <div className="my-4 border-t border-gray-200 dark:border-gray-800" />

          <div className="space-y-1">
            {secondaryNav.map((item) => {
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 dark:border-gray-800">
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Keyboard shortcuts
            </p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
              Press <kbd className="rounded bg-gray-200 px-1 dark:bg-gray-700">⌘K</kbd> to search
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
