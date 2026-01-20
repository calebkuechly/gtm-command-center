'use client'

import { useDashboardStore } from '@/store'
import { SkeletonCard, SkeletonTable } from '@/components/ui'
import {
  HeroSection,
  TodaysSnapshot,
  QuickActions,
  KeyObsessions,
  ActiveBrandStatusBoard,
  WeeklyPriorities,
  ImportantReminders,
  QuickContacts,
  QuickStats,
} from '@/components/dashboard'

function DashboardSkeleton() {
  return (
    <div className="space-y-8 p-6">
      {/* Hero skeleton */}
      <div className="h-48 animate-pulse rounded-2xl bg-gradient-to-r from-primary-200 to-secondary-200 dark:from-primary-900 dark:to-secondary-900" />

      {/* Snapshot skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* Table skeleton */}
      <SkeletonTable rows={5} />
    </div>
  )
}

export default function DashboardPage() {
  const { dashboardData, isLoading, error } = useDashboardStore()

  if (isLoading && !dashboardData) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Failed to load dashboard
          </h2>
          <p className="mt-2 text-gray-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full">
      {/* Main Content */}
      <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-6 lg:p-8">
        {/* Hero Section */}
        <HeroSection />

        {/* Today's Snapshot */}
        <TodaysSnapshot />

        {/* Quick Actions */}
        <QuickActions />

        {/* Key Obsessions */}
        <KeyObsessions />

        {/* Active Brand Status Board */}
        <ActiveBrandStatusBoard />

        {/* Weekly Priorities & Reminders Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <WeeklyPriorities />
          </div>
          <div className="space-y-6">
            <ImportantReminders />
            <QuickContacts />
          </div>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <QuickStats />
    </div>
  )
}
