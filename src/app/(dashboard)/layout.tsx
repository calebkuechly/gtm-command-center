'use client'

import { useEffect } from 'react'
import { Header, Sidebar, CommandPalette } from '@/components/layout'
import { useKeyboardShortcuts, useTheme, useDashboardData } from '@/hooks'
import { useDashboardStore } from '@/store'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Initialize theme
  useTheme()

  // Initialize keyboard shortcuts
  useKeyboardShortcuts()

  // Fetch dashboard data
  const { isLoading, error } = useDashboardData()
  const { sidebarOpen } = useDashboardStore()

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {children}
        </main>
      </div>

      <CommandPalette />
    </div>
  )
}
