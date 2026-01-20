'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { HealthScore } from '@/components/brands/HealthScore'
import { MetricCard } from '@/components/brands/MetricCard'
import { MetricsChart } from '@/components/brands/MetricsChart'
import { ThisWeekFocus } from '@/components/brands/ThisWeekFocus'
import { DecisionTimeline } from '@/components/brands/DecisionTimeline'
import { NotesSection } from '@/components/brands/NotesSection'

interface Brand {
  id: string
  name: string
  stage: string
  status: string
  monthlyRevenue: string | number
  monthlyProfit: string | number
  contributionMargin: string | number
  frontEndRoas: string | number
  backEndLtv: string | number
  daysToBreakeven: number | null
  thisWeekFocus: string | null
  metrics: Array<{
    id: string
    metricType: string
    value: string | number
    date: string
  }>
  decisions: Array<{
    id: string
    decisionType: 'KEEP' | 'PASS' | 'TRANSITION_HOUSE'
    decisionDate: string
    reasoning: string | null
  }>
}

function calculateHealthScore(brand: Brand) {
  const metrics = brand.metrics.filter(m => m.metricType === 'REVENUE')

  // Weights
  const weights = {
    roas: 0.25,
    trend: 0.25,
    margin: 0.20,
    breakeven: 0.15,
    status: 0.15,
  }

  // 1. ROAS vs Target (target: 3.0x)
  const roas = Number(brand.frontEndRoas)
  const roasScore = Math.min(100, (roas / 3.0) * 100)

  // 2. Revenue Trend
  const recent = metrics.slice(0, 7).reduce((sum, m) => sum + Number(m.value), 0)
  const previous = metrics.slice(7, 14).reduce((sum, m) => sum + Number(m.value), 0)
  const trendPct = previous > 0 ? ((recent - previous) / previous) * 100 : 0
  const trendScore = Math.min(100, Math.max(0, 50 + trendPct * 2))

  // 3. Profit Margin (target: 25%)
  const margin = Number(brand.contributionMargin)
  const marginScore = Math.min(100, (margin / 25) * 100)

  // 4. Days to Breakeven (target: 60, lower is better)
  const breakevenScore = brand.daysToBreakeven
    ? Math.max(0, 100 - (brand.daysToBreakeven / 60) * 50)
    : 75

  // 5. Status
  const statusScores: Record<string, number> = { ON_TRACK: 100, NEEDS_ATTENTION: 50, CRITICAL: 0 }
  const statusScore = statusScores[brand.status] ?? 50

  const totalScore = Math.round(
    roasScore * weights.roas +
    trendScore * weights.trend +
    marginScore * weights.margin +
    breakevenScore * weights.breakeven +
    statusScore * weights.status
  )

  return {
    score: totalScore,
    breakdown: {
      roas: Math.round(roasScore),
      trend: Math.round(trendScore),
      margin: Math.round(marginScore),
      breakeven: Math.round(breakevenScore),
      status: Math.round(statusScore),
    },
  }
}

function formatCurrency(value: number | string) {
  const num = Number(value)
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(0)}k`
  return num.toFixed(0)
}

function getStageColor(stage: string) {
  const colors: Record<string, string> = {
    IDEATION: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    TESTING: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    LAUNCH: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    SCALE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    PORTFOLIO: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    HOUSE: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400',
  }
  return colors[stage] || colors.HOUSE
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    ON_TRACK: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    NEEDS_ATTENTION: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    CRITICAL: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }
  return colors[status] || colors.NEEDS_ATTENTION
}

export default function BrandWarRoomPage() {
  const params = useParams()
  const router = useRouter()
  const [brand, setBrand] = useState<Brand | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBrand = async () => {
    try {
      const response = await fetch(`/api/brands/${params.id}`)
      if (!response.ok) {
        if (response.status === 404) {
          setError('Brand not found')
          return
        }
        throw new Error('Failed to fetch brand')
      }
      const data = await response.json()
      setBrand(data)
    } catch (err) {
      console.error('Failed to fetch brand:', err)
      setError('Failed to load brand data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (params.id) {
      fetchBrand()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-[400px] mb-8" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  if (error || !brand) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">{error || 'Brand not found'}</h2>
          <Link href="/brands">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Brands
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const healthData = calculateHealthScore(brand)

  // Calculate MoM changes from metrics
  const revenueMetrics = brand.metrics.filter(m => m.metricType === 'REVENUE')
  const profitMetrics = brand.metrics.filter(m => m.metricType === 'PROFIT')
  const roasMetrics = brand.metrics.filter(m => m.metricType === 'ROAS')

  const calcChange = (metrics: typeof revenueMetrics) => {
    const recent = metrics.slice(0, 7).reduce((sum, m) => sum + Number(m.value), 0)
    const previous = metrics.slice(7, 14).reduce((sum, m) => sum + Number(m.value), 0)
    return previous > 0 ? ((recent - previous) / previous) * 100 : 0
  }

  const revenueChange = calcChange(revenueMetrics)
  const profitChange = calcChange(profitMetrics)
  const roasChange = calcChange(roasMetrics)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-4">
          <Link href="/brands">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Brands
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            {brand.name}
          </h1>
          <Badge className={getStageColor(brand.stage)}>
            {brand.stage}
          </Badge>
          <Badge className={getStatusColor(brand.status)}>
            {brand.status.replace('_', ' ')}
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <HealthScore score={healthData.score} breakdown={healthData.breakdown} />
          <Button variant="outline" size="sm" onClick={fetchBrand}>
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Metric Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <MetricCard
          label="Monthly Revenue"
          value={formatCurrency(brand.monthlyRevenue)}
          prefix="$"
          change={revenueChange}
          changeLabel="vs last week"
          sparklineData={revenueMetrics.slice(0, 14).map(m => Number(m.value)).reverse()}
        />
        <MetricCard
          label="Monthly Profit"
          value={formatCurrency(brand.monthlyProfit)}
          prefix="$"
          change={profitChange}
          changeLabel="vs last week"
          sparklineData={profitMetrics.slice(0, 14).map(m => Number(m.value)).reverse()}
        />
        <MetricCard
          label="Front-End ROAS"
          value={Number(brand.frontEndRoas).toFixed(1)}
          suffix="x"
          change={roasChange}
          changeLabel="vs last week"
          sparklineData={roasMetrics.slice(0, 14).map(m => Number(m.value)).reverse()}
        />
        <MetricCard
          label="Back-End LTV"
          value={formatCurrency(brand.backEndLtv)}
          prefix="$"
        />
      </motion.div>

      {/* Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <MetricsChart metrics={brand.metrics} />
      </motion.div>

      {/* This Week's Focus */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <ThisWeekFocus
          brandId={brand.id}
          initialFocus={brand.thisWeekFocus}
        />
      </motion.div>

      {/* Decision Timeline & Notes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        <DecisionTimeline decisions={brand.decisions} />
        <NotesSection entityType="BRAND" entityId={brand.id} />
      </motion.div>
    </div>
  )
}
