'use client'

import { useState, useEffect } from 'react'
import { formatCurrency, formatRelativeDate } from '@/lib/utils'
import { useDashboardStore } from '@/store'
import { Sparkline } from '@/components/ui'

export function HeroSection() {
  const { dashboardData, lastUpdated } = useDashboardStore()
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  const mostCriticalMetric = dashboardData?.portfolio
    ? {
        label: 'Monthly Recurring Revenue',
        value: formatCurrency(dashboardData.portfolio.totalRevenue, true),
        change: dashboardData.portfolio.revenueChange,
      }
    : null

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 p-8 text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDJ2LTJoMzR6bTAtMzB2Mkgydi0yaDM0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-primary-200 uppercase tracking-wider">
              Director of GTM
            </p>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              Command Center
            </h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-primary-200">
              {currentTime.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="text-xs text-primary-300">
              Last updated: {lastUpdated ? formatRelativeDate(lastUpdated) : 'Loading...'}
            </p>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mb-8">
          <p className="text-lg font-medium text-primary-100 md:text-xl lg:text-2xl">
            Build and scale profitable education brands from zero to $1M+ ARR
          </p>
        </div>

        {/* Most Critical Outcome */}
        {mostCriticalMetric && (
          <div className="inline-flex items-center gap-6 rounded-xl bg-white/10 backdrop-blur-sm p-4 md:p-6">
            <div>
              <p className="text-sm font-medium text-primary-200 mb-1">
                Most Critical Outcome
              </p>
              <p className="text-3xl font-bold md:text-4xl">
                {mostCriticalMetric.value}
              </p>
              <p className="text-sm text-primary-200 mt-1">
                {mostCriticalMetric.label}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <Sparkline
                data={[65, 72, 68, 80, 75, 85, 92]}
                width={100}
                height={40}
                color="rgba(255,255,255,0.8)"
                showArea
              />
              <span
                className={`mt-2 text-sm font-medium ${
                  mostCriticalMetric.change >= 0
                    ? 'text-success-300'
                    : 'text-danger-300'
                }`}
              >
                {mostCriticalMetric.change >= 0 ? '+' : ''}
                {mostCriticalMetric.change.toFixed(1)}% vs last month
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
