'use client'

import { useQuery } from '@tanstack/react-query'
import { Building2, TrendingUp, TrendingDown, DollarSign, Target, Clock } from 'lucide-react'
import { cn, formatCurrency, formatNumber } from '@/lib/utils'

interface Brand {
  id: string
  name: string
  stage: string
  status: string
  monthlyRevenue: number
  monthlyProfit: number
  frontEndRoas: number
  backEndLtv: number
  daysToBreakeven: number | null
  visionary: {
    name: string
  } | null
}

async function fetchBrands() {
  const res = await fetch('/api/brands')
  return res.json()
}

const stageColors: Record<string, string> = {
  IDEATION: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  TESTING: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  LAUNCH: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  GROWTH: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  PORTFOLIO: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  HOUSE: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
}

const statusColors: Record<string, string> = {
  ON_TRACK: 'text-green-600 dark:text-green-400',
  AT_RISK: 'text-yellow-600 dark:text-yellow-400',
  OFF_TRACK: 'text-red-600 dark:text-red-400',
  PAUSED: 'text-gray-500 dark:text-gray-400',
}

export default function BrandsPage() {
  const { data: brands, isLoading } = useQuery<Brand[]>({
    queryKey: ['brands'],
    queryFn: fetchBrands,
  })

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 rounded-xl bg-gray-200 dark:bg-gray-800" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const totalRevenue = brands?.reduce((sum, b) => sum + Number(b.monthlyRevenue), 0) || 0
  const totalProfit = brands?.reduce((sum, b) => sum + Number(b.monthlyProfit), 0) || 0
  const avgRoas = brands?.length
    ? brands.reduce((sum, b) => sum + Number(b.frontEndRoas), 0) / brands.length
    : 0

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Brands</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage and monitor all brands in your portfolio
        </p>
      </div>

      {/* Summary Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Profit</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalProfit)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
              <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg ROAS</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{formatNumber(avgRoas, 2)}x</p>
            </div>
          </div>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {brands?.map((brand) => (
          <div
            key={brand.id}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{brand.name}</h3>
                {brand.visionary && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">by {brand.visionary.name}</p>
                )}
              </div>
              <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', stageColors[brand.stage])}>
                {brand.stage}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Monthly Revenue</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(Number(brand.monthlyRevenue))}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Monthly Profit</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(Number(brand.monthlyProfit))}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Front-End ROAS</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatNumber(Number(brand.frontEndRoas), 2)}x
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Back-End LTV</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(Number(brand.backEndLtv))}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <span className={cn('text-sm font-medium', statusColors[brand.status])}>
                  {brand.status.replace('_', ' ')}
                </span>
              </div>
              {brand.daysToBreakeven && (
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  {brand.daysToBreakeven}d to breakeven
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
