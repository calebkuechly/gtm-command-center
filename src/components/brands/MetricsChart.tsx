'use client'

import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Metric {
  id: string
  metricType: string
  value: string | number
  date: string
}

interface MetricsChartProps {
  metrics: Metric[]
}

type TimeRange = '7d' | '30d' | '90d'

export function MetricsChart({ metrics }: MetricsChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d')

  const getDaysForRange = (range: TimeRange) => {
    switch (range) {
      case '7d': return 7
      case '30d': return 30
      case '90d': return 90
    }
  }

  // Group metrics by date and type
  const processedData = () => {
    const days = getDaysForRange(timeRange)
    const revenueMetrics = metrics
      .filter(m => m.metricType === 'REVENUE')
      .slice(0, days)
      .reverse()

    const profitMetrics = metrics
      .filter(m => m.metricType === 'PROFIT')
      .slice(0, days)
      .reverse()

    // Combine by date
    const dataMap = new Map()

    revenueMetrics.forEach(m => {
      const dateKey = m.date.split('T')[0]
      dataMap.set(dateKey, {
        date: dateKey,
        revenue: Number(m.value),
        profit: 0,
      })
    })

    profitMetrics.forEach(m => {
      const dateKey = m.date.split('T')[0]
      if (dataMap.has(dateKey)) {
        dataMap.get(dateKey).profit = Number(m.value)
      } else {
        dataMap.set(dateKey, {
          date: dateKey,
          revenue: 0,
          profit: Number(m.value),
        })
      }
    })

    return Array.from(dataMap.values()).sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  }

  const data = processedData()

  const formatCurrency = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`
    }
    return `$${value.toFixed(0)}`
  }

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'MMM d')
    } catch {
      return dateStr
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Performance</CardTitle>
          <div className="flex gap-1">
            {(['7d', '30d', '90d'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-700" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                className="text-xs"
                tick={{ fill: '#71717a' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={formatCurrency}
                className="text-xs"
                tick={{ fill: '#71717a' }}
                tickLine={false}
                axisLine={false}
                width={60}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg p-3">
                        <p className="text-sm font-medium mb-2">{formatDate(label)}</p>
                        {payload.map((entry, index) => (
                          <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: {formatCurrency(entry.value as number)}
                          </p>
                        ))}
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(value) => <span className="text-sm text-zinc-600 dark:text-zinc-400">{value}</span>}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="profit"
                name="Profit"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
