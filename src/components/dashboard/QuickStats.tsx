'use client'

import { Card, Sparkline, Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui'
import { useDashboardStore } from '@/store'
import { formatCurrency, formatPercentage, cn } from '@/lib/utils'
import {
  DollarSign,
  TrendingUp,
  Target,
  Users,
  Percent,
  Clock,
  Rocket,
  FlaskConical,
} from 'lucide-react'

interface StatCardProps {
  label: string
  value: string
  change?: number
  icon: React.ComponentType<{ className?: string }>
  trend?: number[]
  info?: string
}

function StatCard({ label, value, change, icon: Icon, trend, info }: StatCardProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800 cursor-help">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
              <Icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {label}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {value}
                </span>
                {change !== undefined && (
                  <span
                    className={cn(
                      'text-xs font-medium',
                      change > 0 && 'text-success-600',
                      change < 0 && 'text-danger-600',
                      change === 0 && 'text-gray-500'
                    )}
                  >
                    {change > 0 ? '↑' : change < 0 ? '↓' : ''}
                    {Math.abs(change).toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
            {trend && (
              <Sparkline
                data={trend}
                width={60}
                height={24}
                className={cn(
                  change && change > 0 ? 'text-success-500' : 'text-danger-500'
                )}
              />
            )}
          </div>
        </TooltipTrigger>
        {info && (
          <TooltipContent>
            <p className="text-sm">{info}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}

export function QuickStats() {
  const { dashboardData } = useDashboardStore()
  const quickStats = dashboardData?.quickStats

  const portfolioStats = [
    {
      label: 'Total Revenue',
      value: formatCurrency(quickStats?.portfolioMetrics.totalRevenue || 0, true),
      change: quickStats?.portfolioMetrics.revenueChange,
      icon: DollarSign,
      trend: [42, 48, 45, 52, 58, 55, 62],
      info: 'Month-to-date revenue across all active brands',
    },
    {
      label: 'Total Profit',
      value: formatCurrency(quickStats?.portfolioMetrics.totalProfit || 0, true),
      change: quickStats?.portfolioMetrics.profitChange,
      icon: TrendingUp,
      trend: [15, 18, 16, 22, 25, 23, 28],
      info: 'Month-to-date profit after all expenses',
    },
    {
      label: 'Blended ROAS',
      value: `${(quickStats?.portfolioMetrics.blendedRoas || 0).toFixed(1)}x`,
      icon: Target,
      trend: [2.2, 2.4, 2.3, 2.5, 2.8, 2.6, 2.9],
      info: 'Average return on ad spend across portfolio',
    },
    {
      label: 'Avg LTV',
      value: formatCurrency(quickStats?.portfolioMetrics.averageLtv || 0),
      icon: Users,
      trend: [320, 350, 340, 380, 400, 390, 420],
      info: 'Average customer lifetime value',
    },
  ]

  const teamStats = [
    {
      label: 'Avg CPA',
      value: formatCurrency(quickStats?.teamPerformance.avgCpa || 0),
      icon: Percent,
      info: 'Average cost per acquisition',
    },
    {
      label: 'Close Rate',
      value: `${(quickStats?.teamPerformance.avgCloseRate || 0).toFixed(1)}%`,
      icon: Target,
      info: 'Sales team average close rate',
    },
    {
      label: 'Response Time',
      value: `${(quickStats?.teamPerformance.avgResponseTime || 0).toFixed(1)}h`,
      icon: Clock,
      info: 'Average lead response time',
    },
  ]

  const pipelineStats = [
    {
      label: 'Pipeline',
      value: `${quickStats?.pipelineHealth.visionariesInPipeline || 0}`,
      icon: Users,
      info: 'Visionary candidates in pipeline',
    },
    {
      label: 'Validating',
      value: `${quickStats?.pipelineHealth.conceptsInValidation || 0}`,
      icon: FlaskConical,
      info: 'Concepts in validation phase',
    },
    {
      label: 'Launching',
      value: `${quickStats?.pipelineHealth.launchingThisQuarter || 0}`,
      icon: Rocket,
      info: 'Brands launching this quarter',
    },
  ]

  return (
    <section className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Portfolio Metrics */}
          <div className="lg:col-span-2">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
              Portfolio Metrics (MTD)
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {portfolioStats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>
          </div>

          {/* Team Performance */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
              Team Performance
            </p>
            <div className="space-y-2">
              {teamStats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>
          </div>

          {/* Pipeline Health */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
              Pipeline Health
            </p>
            <div className="space-y-2">
              {pipelineStats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
