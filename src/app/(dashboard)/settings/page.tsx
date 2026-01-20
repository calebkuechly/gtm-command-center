'use client'

import { useState } from 'react'
import { Cog, Moon, Sun, Monitor, Bell, Shield, User, Palette } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDashboardStore } from '@/store'

export default function SettingsPage() {
  const { theme, setTheme } = useDashboardStore()
  const [notifications, setNotifications] = useState({
    alerts: true,
    weeklyDigest: true,
    milestones: true,
    pipelineUpdates: false,
  })

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Customize your dashboard experience
        </p>
      </div>

      <div className="max-w-2xl space-y-8">
        {/* Appearance */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
              <Palette className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">Appearance</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Customize how the dashboard looks</p>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
            <div className="mt-2 flex gap-3">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value as 'light' | 'dark' | 'system')}
                  className={cn(
                    'flex flex-1 flex-col items-center gap-2 rounded-lg border p-4 transition-colors',
                    theme === option.value
                      ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/20'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                  )}
                >
                  <option.icon className={cn(
                    'h-6 w-6',
                    theme === option.value ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'
                  )} />
                  <span className={cn(
                    'text-sm font-medium',
                    theme === option.value ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'
                  )}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">Notifications</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage your notification preferences</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {key === 'alerts' && 'Get notified about important alerts'}
                    {key === 'weeklyDigest' && 'Receive a weekly summary email'}
                    {key === 'milestones' && 'Get notified when milestones are reached'}
                    {key === 'pipelineUpdates' && 'Get notified about pipeline changes'}
                  </p>
                </div>
                <button
                  onClick={() => setNotifications(n => ({ ...n, [key]: !value }))}
                  className={cn(
                    'relative h-6 w-11 rounded-full transition-colors',
                    value ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                  )}
                >
                  <span className={cn(
                    'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
                    value && 'translate-x-5'
                  )} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Account */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
              <User className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">Account</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account settings</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                defaultValue="director@company.com"
                className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                disabled
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <input
                type="text"
                defaultValue="GTM Director"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>
          </div>
        </section>

        {/* Keyboard Shortcuts */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
              <Cog className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">Keyboard Shortcuts</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Quick access to common actions</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {[
              { keys: ['⌘', 'K'], action: 'Open command palette' },
              { keys: ['⌘', 'B'], action: 'Toggle sidebar' },
              { keys: ['⌘', '/'], action: 'Show keyboard shortcuts' },
              { keys: ['⌘', 'D'], action: 'Toggle dark mode' },
              { keys: ['G', 'H'], action: 'Go to dashboard' },
              { keys: ['G', 'P'], action: 'Go to pipeline' },
              { keys: ['G', 'B'], action: 'Go to brands' },
            ].map((shortcut, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">{shortcut.action}</span>
                <div className="flex gap-1">
                  {shortcut.keys.map((key, j) => (
                    <kbd
                      key={j}
                      className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
