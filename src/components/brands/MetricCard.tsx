'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Sparkline } from '@/components/ui/sparkline'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string
  change?: number
  changeLabel?: string
  sparklineData?: number[]
  prefix?: string
  suffix?: string
}

export function MetricCard({
  label,
  value,
  change,
  changeLabel,
  sparklineData,
  prefix = '',
  suffix = '',
}: MetricCardProps) {
  const getTrendIcon = () => {
    if (!change || change === 0) return <Minus className="w-3 h-3" />
    return change > 0 ? (
      <TrendingUp className="w-3 h-3" />
    ) : (
      <TrendingDown className="w-3 h-3" />
    )
  }

  const getTrendColor = () => {
    if (!change || change === 0) return 'text-zinc-500'
    return change > 0 ? 'text-emerald-500' : 'text-red-500'
  }

  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">{label}</p>
        <p className="text-2xl font-bold text-zinc-900 dark:text-white">
          {prefix}{value}{suffix}
        </p>

        {change !== undefined && (
          <div className={`flex items-center gap-1 mt-1 text-sm ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>
              {change > 0 ? '+' : ''}{change.toFixed(1)}%
              {changeLabel && <span className="text-zinc-400 ml-1">{changeLabel}</span>}
            </span>
          </div>
        )}

        {sparklineData && sparklineData.length > 0 && (
          <div className="mt-3 h-8">
            <Sparkline data={sparklineData} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
