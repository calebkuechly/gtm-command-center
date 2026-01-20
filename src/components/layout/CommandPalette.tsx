'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import { useDashboardStore } from '@/store'
import { cn } from '@/lib/utils'
import {
  Search,
  LayoutDashboard,
  GitBranch,
  Building2,
  BarChart3,
  Users,
  CalendarDays,
  Plus,
  Settings,
  Moon,
  Sun,
  Monitor,
  FileText,
  Zap,
} from 'lucide-react'

interface CommandItem {
  id: string
  title: string
  subtitle?: string
  icon: React.ComponentType<{ className?: string }>
  action: () => void
  keywords?: string[]
  category: 'navigation' | 'actions' | 'settings'
}

export function CommandPalette() {
  const router = useRouter()
  const { commandPaletteOpen, setCommandPaletteOpen, setTheme } = useDashboardStore()
  const [search, setSearch] = useState('')

  const closeAndNavigate = useCallback(
    (path: string) => {
      setCommandPaletteOpen(false)
      router.push(path)
    },
    [router, setCommandPaletteOpen]
  )

  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'dashboard',
      title: 'Go to Dashboard',
      subtitle: 'Main overview',
      icon: LayoutDashboard,
      action: () => closeAndNavigate('/'),
      keywords: ['home', 'main'],
      category: 'navigation',
    },
    {
      id: 'pipeline',
      title: 'Go to Pipeline',
      subtitle: 'Visionary funnel',
      icon: GitBranch,
      action: () => closeAndNavigate('/pipeline'),
      keywords: ['funnel', 'visionaries'],
      category: 'navigation',
    },
    {
      id: 'brands',
      title: 'Go to Brands',
      subtitle: 'Active brands',
      icon: Building2,
      action: () => closeAndNavigate('/brands'),
      keywords: ['active', 'portfolio'],
      category: 'navigation',
    },
    {
      id: 'metrics',
      title: 'Go to Metrics',
      subtitle: 'Performance data',
      icon: BarChart3,
      action: () => closeAndNavigate('/metrics'),
      keywords: ['analytics', 'kpis', 'performance'],
      category: 'navigation',
    },
    {
      id: 'visionaries',
      title: 'Go to Visionaries',
      subtitle: 'Candidate list',
      icon: Users,
      action: () => closeAndNavigate('/visionaries'),
      keywords: ['candidates', 'prospects'],
      category: 'navigation',
    },
    {
      id: 'weekly',
      title: 'Go to Weekly Plan',
      subtitle: 'This week priorities',
      icon: CalendarDays,
      action: () => closeAndNavigate('/weekly'),
      keywords: ['planning', 'tasks', 'priorities'],
      category: 'navigation',
    },

    // Actions
    {
      id: 'new-brand',
      title: 'Create New Brand',
      subtitle: 'Add a brand to portfolio',
      icon: Plus,
      action: () => {
        setCommandPaletteOpen(false)
        // Would open modal or navigate
      },
      keywords: ['add', 'create'],
      category: 'actions',
    },
    {
      id: 'new-visionary',
      title: 'Add Visionary Candidate',
      subtitle: 'New pipeline prospect',
      icon: Users,
      action: () => {
        setCommandPaletteOpen(false)
        // Would open modal
      },
      keywords: ['add', 'create', 'prospect'],
      category: 'actions',
    },
    {
      id: 'new-task',
      title: 'Add Priority Task',
      subtitle: 'Add to this week',
      icon: FileText,
      action: () => {
        setCommandPaletteOpen(false)
        // Would open modal
      },
      keywords: ['add', 'task', 'todo'],
      category: 'actions',
    },
    {
      id: 'quick-report',
      title: 'Generate Quick Report',
      subtitle: 'Export portfolio summary',
      icon: Zap,
      action: () => {
        setCommandPaletteOpen(false)
        // Would generate report
      },
      keywords: ['export', 'pdf', 'summary'],
      category: 'actions',
    },

    // Settings
    {
      id: 'theme-light',
      title: 'Light Theme',
      subtitle: 'Switch to light mode',
      icon: Sun,
      action: () => {
        setTheme('light')
        setCommandPaletteOpen(false)
      },
      keywords: ['theme', 'mode', 'appearance'],
      category: 'settings',
    },
    {
      id: 'theme-dark',
      title: 'Dark Theme',
      subtitle: 'Switch to dark mode',
      icon: Moon,
      action: () => {
        setTheme('dark')
        setCommandPaletteOpen(false)
      },
      keywords: ['theme', 'mode', 'appearance'],
      category: 'settings',
    },
    {
      id: 'theme-system',
      title: 'System Theme',
      subtitle: 'Match system preference',
      icon: Monitor,
      action: () => {
        setTheme('system')
        setCommandPaletteOpen(false)
      },
      keywords: ['theme', 'mode', 'appearance'],
      category: 'settings',
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'App preferences',
      icon: Settings,
      action: () => closeAndNavigate('/settings'),
      keywords: ['preferences', 'config'],
      category: 'settings',
    },
  ]

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false)
      }
    }

    if (commandPaletteOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [commandPaletteOpen, setCommandPaletteOpen])

  if (!commandPaletteOpen) return null

  const navigationCommands = commands.filter((c) => c.category === 'navigation')
  const actionCommands = commands.filter((c) => c.category === 'actions')
  const settingsCommands = commands.filter((c) => c.category === 'settings')

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={() => setCommandPaletteOpen(false)}
      />

      {/* Command Palette */}
      <div className="fixed inset-x-4 top-[20%] z-50 mx-auto max-w-xl animate-scale-in sm:inset-x-auto">
        <Command
          className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800"
          loop
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 border-b border-gray-100 px-4 dark:border-gray-700">
            <Search className="h-5 w-5 text-gray-400" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Type a command or search..."
              className="flex-1 bg-transparent py-4 text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
              autoFocus
            />
            <kbd className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500 dark:bg-gray-700">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <Command.List className="max-h-96 overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-gray-500">
              No results found.
            </Command.Empty>

            {/* Navigation */}
            <Command.Group heading="Navigation" className="px-2 py-1.5">
              <p className="mb-2 text-xs font-medium text-gray-500">Navigation</p>
              {navigationCommands.map((command) => (
                <Command.Item
                  key={command.id}
                  value={`${command.title} ${command.keywords?.join(' ')}`}
                  onSelect={command.action}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors aria-selected:bg-primary-50 aria-selected:text-primary-900 dark:aria-selected:bg-primary-900/30 dark:aria-selected:text-primary-100"
                >
                  <command.icon className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {command.title}
                    </p>
                    {command.subtitle && (
                      <p className="text-xs text-gray-500">{command.subtitle}</p>
                    )}
                  </div>
                </Command.Item>
              ))}
            </Command.Group>

            {/* Actions */}
            <Command.Group heading="Actions" className="px-2 py-1.5">
              <p className="mb-2 text-xs font-medium text-gray-500">Actions</p>
              {actionCommands.map((command) => (
                <Command.Item
                  key={command.id}
                  value={`${command.title} ${command.keywords?.join(' ')}`}
                  onSelect={command.action}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors aria-selected:bg-primary-50 aria-selected:text-primary-900 dark:aria-selected:bg-primary-900/30 dark:aria-selected:text-primary-100"
                >
                  <command.icon className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {command.title}
                    </p>
                    {command.subtitle && (
                      <p className="text-xs text-gray-500">{command.subtitle}</p>
                    )}
                  </div>
                </Command.Item>
              ))}
            </Command.Group>

            {/* Settings */}
            <Command.Group heading="Settings" className="px-2 py-1.5">
              <p className="mb-2 text-xs font-medium text-gray-500">Settings</p>
              {settingsCommands.map((command) => (
                <Command.Item
                  key={command.id}
                  value={`${command.title} ${command.keywords?.join(' ')}`}
                  onSelect={command.action}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors aria-selected:bg-primary-50 aria-selected:text-primary-900 dark:aria-selected:bg-primary-900/30 dark:aria-selected:text-primary-100"
                >
                  <command.icon className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {command.title}
                    </p>
                    {command.subtitle && (
                      <p className="text-xs text-gray-500">{command.subtitle}</p>
                    )}
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2 text-xs text-gray-500 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>ESC Close</span>
            </div>
          </div>
        </Command>
      </div>
    </>
  )
}
