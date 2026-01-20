'use client'

import { useQuery } from '@tanstack/react-query'
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Target, Users, ShoppingCart } from 'lucide-react'
import { cn, formatCurrency, formatNumber, formatPercent } from '@/lib/utils'
import { useDashboardStore } from '@/store'

export default function MetricsPage() {
  const { dashboardData } = useDashboardStore()

  const portfolio = dashboardData?.portfolio
  const quickStats = dashboardData?.quickStats

  if (!dashboardData) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 rounded-xl bg-gray-200 dark:bg-gray-800" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const metrics = [
    {
      title: 'Total Revenue',
      value: formatCurrency(portfolio?.totalRevenue || 0),
      change: portfolio?.revenueChange || 0,
      icon: DollarSign,
      color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    },
    {
      title: 'Total Profit',
      value: formatCurrency(portfolio?.totalProfit || 0),
      change: portfolio?.profitChange || 0,
      icon: TrendingUp,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
      title: 'Contribution Margin',
      value: formatPercent(portfolio?.contributionMargin || 0),
      change: portfolio?.marginChange || 0,
      icon: Target,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    },
    {
      title: 'Active Brands',
      value: portfolio?.activeBrandsCount || 0,
      icon: ShoppingCart,
      color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    },
    {
      title: 'Blended ROAS',
      value: `${formatNumber(quickStats?.portfolioMetrics?.blendedRoas || 0, 2)}x`,
      icon: BarChart3,
      color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
    },
    {
      title: 'Average LTV',
      value: formatCurrency(quickStats?.portfolioMetrics?.averageLtv || 0),
      icon: Users,
      color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
    },
    {
      title: 'Avg CPA',
      value: formatCurrency(quickStats?.teamPerformance?.avgCpa || 0),
      icon: Target,
      color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    {
      title: 'Close Rate',
      value: formatPercent(quickStats?.teamPerformance?.avgCloseRate || 0),
      icon: TrendingUp,
      color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Metrics</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Portfolio performance and key metrics overview
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.title}
            className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <div className={cn('rounded-lg p-2', metric.color)}>
                <metric.icon className="h-5 w-5" />
              </div>
              {metric.change !== undefined && metric.change !== 0 && (
                <div className={cn(
                  'flex items-center gap-1 text-sm font-medium',
                  metric.change > 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {metric.change > 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {formatPercent(Math.abs(metric.change))}
                </div>
              )}
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">{metric.title}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Health */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Pipeline Health</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">Visionaries in Pipeline</p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {quickStats?.pipelineHealth?.visionariesInPipeline || 0}
            </p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">Concepts in Validation</p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {quickStats?.pipelineHealth?.conceptsInValidation || 0}
            </p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">Launching This Quarter</p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {quickStats?.pipelineHealth?.launchingThisQuarter || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Key Obsessions Summary */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Key Obsessions</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-900">
            <h3 className="font-medium text-gray-900 dark:text-white">Speed to Breakeven</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
              {dashboardData.keyObsessions?.speedToBreakeven?.averageDays || 0} days
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Average across all launches</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-900">
            <h3 className="font-medium text-gray-900 dark:text-white">ROAS & LTV Performance</h3>
            <div className="mt-2 flex items-baseline gap-4">
              <div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatNumber(dashboardData.keyObsessions?.roasAndLtv?.portfolioAvgRoas || 0, 2)}x
                </p>
                <p className="text-xs text-gray-500">Avg ROAS</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {formatCurrency(dashboardData.keyObsessions?.roasAndLtv?.portfolioAvgLtv || 0)}
                </p>
                <p className="text-xs text-gray-500">Avg LTV</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
