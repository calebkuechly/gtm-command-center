'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, Badge, CircularProgress, Sparkline } from '@/components/ui'
import { formatCurrency, formatPercentage, cn } from '@/lib/utils'
import { useDashboardStore } from '@/store'
import { useUpdatePriority } from '@/hooks'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  Users,
  Target,
  Rocket,
  Lightbulb,
  FlaskConical,
  CheckCircle2,
  Circle,
  GripVertical,
  ArrowRight,
} from 'lucide-react'

function TrendIndicator({ value }: { value: number }) {
  if (value > 1) {
    return <TrendingUp className="h-4 w-4 text-success-500" />
  }
  if (value < -1) {
    return <TrendingDown className="h-4 w-4 text-danger-500" />
  }
  return <Minus className="h-4 w-4 text-gray-400" />
}

function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  trend,
}: {
  title: string
  value: string
  change?: number
  icon: React.ComponentType<{ className?: string }>
  trend?: number[]
}) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
          <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {change !== undefined && (
            <div className="mt-1 flex items-center gap-1">
              <TrendIndicator value={change} />
              <span
                className={cn(
                  'text-sm font-medium',
                  change > 0 && 'text-success-600',
                  change < 0 && 'text-danger-600',
                  change === 0 && 'text-gray-500'
                )}
              >
                {formatPercentage(change, true)}
              </span>
            </div>
          )}
        </div>
      </div>
      {trend && (
        <Sparkline
          data={trend}
          className="text-primary-500"
          showArea
        />
      )}
    </div>
  )
}

function PipelineItem({
  label,
  count,
  icon: Icon,
  highlight = false,
}: {
  label: string
  count: number
  icon: React.ComponentType<{ className?: string }>
  highlight?: boolean
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-lg p-3',
        highlight
          ? 'bg-success-100 dark:bg-success-900/30'
          : 'bg-gray-50 dark:bg-gray-800/50'
      )}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={cn(
            'h-5 w-5',
            highlight
              ? 'text-success-600 dark:text-success-400'
              : 'text-gray-500 dark:text-gray-400'
          )}
        />
        <span
          className={cn(
            'text-sm font-medium',
            highlight
              ? 'text-success-800 dark:text-success-200'
              : 'text-gray-700 dark:text-gray-300'
          )}
        >
          {label}
        </span>
      </div>
      <Badge variant={highlight ? 'success' : 'default'}>{count}</Badge>
    </div>
  )
}

export function TodaysSnapshot() {
  const { dashboardData } = useDashboardStore()
  const updatePriority = useUpdatePriority()
  const [editingPriorityId, setEditingPriorityId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const portfolio = dashboardData?.portfolio
  const pipeline = dashboardData?.pipeline
  const weeklyFocus = dashboardData?.weeklyFocus

  // Get top 3 priorities for today
  const topPriorities = weeklyFocus?.priorities.slice(0, 3) || []

  const handlePriorityEdit = (id: string, currentTitle: string) => {
    setEditingPriorityId(id)
    setEditValue(currentTitle)
  }

  const handlePrioritySave = (id: string) => {
    if (editValue.trim()) {
      updatePriority.mutate({ id, data: { title: editValue.trim() } })
    }
    setEditingPriorityId(null)
  }

  const handlePriorityToggle = (id: string, completed: boolean) => {
    updatePriority.mutate({ id, data: { completed: !completed } })
  }

  return (
    <section className="grid gap-6 lg:grid-cols-3">
      {/* Column 1: Portfolio Performance */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Portfolio Performance
            </h2>
            <Badge variant="outline">MTD</Badge>
          </div>

          <div className="space-y-6">
            <MetricCard
              title="Monthly Revenue"
              value={formatCurrency(portfolio?.totalRevenue || 0, true)}
              change={portfolio?.revenueChange}
              icon={DollarSign}
              trend={[42, 48, 45, 52, 58, 55, 62]}
            />

            <MetricCard
              title="Monthly Profit"
              value={formatCurrency(portfolio?.totalProfit || 0, true)}
              change={portfolio?.profitChange}
              icon={TrendingUp}
              trend={[15, 18, 16, 22, 25, 23, 28]}
            />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Contribution Margin
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {(portfolio?.contributionMargin || 0).toFixed(1)}%
                </p>
              </div>
              <CircularProgress
                value={portfolio?.contributionMargin || 0}
                size={64}
                strokeWidth={6}
              />
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Active Brands
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {portfolio?.activeBrandsCount || 0}
                </span>
                <div className="flex gap-0.5">
                  <span className="h-2 w-2 rounded-full bg-success-500" />
                  <span className="h-2 w-2 rounded-full bg-success-500" />
                  <span className="h-2 w-2 rounded-full bg-warning-500" />
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="mt-4 flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            View Full Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </CardContent>
      </Card>

      {/* Column 2: Pipeline Status */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Pipeline Status
            </h2>
          </div>

          <div className="space-y-3">
            <PipelineItem
              label="Visionary Candidates"
              count={pipeline?.visionaryCandidates || 0}
              icon={Users}
            />
            <PipelineItem
              label="In Ideation"
              count={pipeline?.inIdeation || 0}
              icon={Lightbulb}
            />
            <PipelineItem
              label="Testing"
              count={pipeline?.inTesting || 0}
              icon={FlaskConical}
            />
            <PipelineItem
              label="Ready to Launch"
              count={pipeline?.readyToLaunch || 0}
              icon={Rocket}
              highlight={(pipeline?.readyToLaunch || 0) > 0}
            />
          </div>

          <Link
            href="/pipeline"
            className="mt-6 flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            View Pipeline <ArrowRight className="h-4 w-4" />
          </Link>
        </CardContent>
      </Card>

      {/* Column 3: This Week's Focus */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              This Week's Focus
            </h2>
            <Badge variant="primary">
              {weeklyFocus?.completedCount || 0}/{weeklyFocus?.totalCount || 0}
            </Badge>
          </div>

          <div className="space-y-3">
            {topPriorities.length > 0 ? (
              topPriorities.map((priority, index) => (
                <div
                  key={priority.id}
                  className="group flex items-center gap-3 rounded-lg border border-gray-100 p-3 dark:border-gray-800"
                >
                  <GripVertical className="h-4 w-4 cursor-grab text-gray-300 opacity-0 transition-opacity group-hover:opacity-100" />
                  <button
                    onClick={() =>
                      handlePriorityToggle(priority.id, priority.completed)
                    }
                    className="flex-shrink-0"
                  >
                    {priority.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-success-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-300 hover:text-gray-400" />
                    )}
                  </button>
                  {editingPriorityId === priority.id ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => handlePrioritySave(priority.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handlePrioritySave(priority.id)
                        if (e.key === 'Escape') setEditingPriorityId(null)
                      }}
                      className="flex-1 bg-transparent text-sm focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <span
                      className={cn(
                        'flex-1 cursor-pointer text-sm',
                        priority.completed
                          ? 'text-gray-400 line-through'
                          : 'text-gray-700 dark:text-gray-300'
                      )}
                      onClick={() =>
                        handlePriorityEdit(priority.id, priority.title)
                      }
                    >
                      <span className="mr-2 font-medium text-gray-400">
                        {index + 1}.
                      </span>
                      {priority.title}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-sm text-gray-500">
                No priorities set for this week
              </p>
            )}
          </div>

          <Link
            href="/weekly"
            className="mt-6 flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            View Weekly Plan <ArrowRight className="h-4 w-4" />
          </Link>
        </CardContent>
      </Card>
    </section>
  )
}
