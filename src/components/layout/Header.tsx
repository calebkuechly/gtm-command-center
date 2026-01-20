'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTheme } from '@/hooks'
import { useDashboardStore, selectUnreadAlertCount } from '@/store'
import { Button, Badge } from '@/components/ui'
import { formatShortcut } from '@/lib/utils'
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Monitor,
  Settings,
  User,
  LogOut,
  HelpCircle,
  Command,
} from 'lucide-react'

export function Header() {
  const { theme, setTheme, toggleTheme } = useTheme()
  const { setCommandPaletteOpen, toggleSidebar } = useDashboardStore()
  const unreadCount = useDashboardStore(selectUnreadAlertCount)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-secondary-600">
            <span className="text-sm font-bold text-white">G</span>
          </div>
          <span className="hidden font-semibold text-gray-900 dark:text-white sm:inline">
            GTM Command
          </span>
        </Link>
      </div>

      {/* Center - Search */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="hidden items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-500 transition-colors hover:border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 md:flex"
      >
        <Search className="h-4 w-4" />
        <span>Search...</span>
        <kbd className="ml-4 flex items-center gap-0.5 rounded bg-gray-200 px-1.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
          <Command className="h-3 w-3" />K
        </kbd>
      </button>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Mobile search */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCommandPaletteOpen(true)}
          className="md:hidden"
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Theme toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          <ThemeIcon className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger-500 text-[10px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>

          {/* Notifications dropdown */}
          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="border-b border-gray-100 p-4 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-4 text-center text-sm text-gray-500">
                    No new notifications
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Help */}
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
        </Button>

        {/* User menu */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="overflow-hidden rounded-full"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
              D
            </div>
          </Button>

          {/* User dropdown */}
          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="border-b border-gray-100 p-4 dark:border-gray-700">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    GTM Director
                  </p>
                  <p className="text-sm text-gray-500">director@company.com</p>
                </div>
                <div className="p-2">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                  <hr className="my-2 border-gray-100 dark:border-gray-700" />
                  <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20">
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
