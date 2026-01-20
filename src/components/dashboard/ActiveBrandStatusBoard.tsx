'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, Badge, Button, Input, Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui'
import { useDashboardStore, selectFilteredBrands } from '@/store'
import { useUpdateBrand } from '@/hooks'
import {
  formatCurrency,
  getStageColor,
  getStatusEmoji,
  cn,
} from '@/lib/utils'
import type { BrandWithRelations, BrandStage, BrandStatus } from '@/types'
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Edit2,
  MoreHorizontal,
  X,
} from 'lucide-react'

type SortField = 'name' | 'stage' | 'monthlyRevenue' | 'monthlyProfit' | 'status'
type SortDirection = 'asc' | 'desc'

const stageOptions: BrandStage[] = ['IDEATION', 'TESTING', 'LAUNCH', 'SCALE', 'PORTFOLIO']
const statusOptions: BrandStatus[] = ['ON_TRACK', 'NEEDS_ATTENTION', 'CRITICAL']

function StatusTooltip({ status }: { status: BrandStatus }) {
  const explanations: Record<BrandStatus, string> = {
    ON_TRACK: 'Revenue above target, margin > 20%',
    NEEDS_ATTENTION: 'Revenue 80-100% of target or margin 15-20%',
    CRITICAL: 'Revenue < 80% of target or margin < 15%',
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <span className="cursor-help text-lg">{getStatusEmoji(status)}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">{explanations[status]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function TrendArrow({ current, previous }: { current: number; previous: number }) {
  const change = previous ? ((current - previous) / previous) * 100 : 0

  if (Math.abs(change) < 1) {
    return <span className="text-gray-400">-</span>
  }

  return change > 0 ? (
    <ArrowUp className="h-4 w-4 text-success-500" />
  ) : (
    <ArrowDown className="h-4 w-4 text-danger-500" />
  )
}

export function ActiveBrandStatusBoard() {
  const { dashboardData, brandStageFilter, brandStatusFilter, searchQuery, setBrandStageFilter, setBrandStatusFilter, setSearchQuery } = useDashboardStore()
  const filteredBrands = useDashboardStore(selectFilteredBrands)
  const updateBrand = useUpdateBrand()

  const [sortField, setSortField] = useState<SortField>('monthlyRevenue')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [expandedBrandId, setExpandedBrandId] = useState<string | null>(null)
  const [editingFocusId, setEditingFocusId] = useState<string | null>(null)
  const [focusValue, setFocusValue] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const sortedBrands = useMemo(() => {
    return [...filteredBrands].sort((a, b) => {
      let aVal: string | number = ''
      let bVal: string | number = ''

      switch (sortField) {
        case 'name':
          aVal = a.name.toLowerCase()
          bVal = b.name.toLowerCase()
          break
        case 'stage':
          aVal = stageOptions.indexOf(a.stage as BrandStage)
          bVal = stageOptions.indexOf(b.stage as BrandStage)
          break
        case 'monthlyRevenue':
          aVal = Number(a.monthlyRevenue)
          bVal = Number(b.monthlyRevenue)
          break
        case 'monthlyProfit':
          aVal = Number(a.monthlyProfit)
          bVal = Number(b.monthlyProfit)
          break
        case 'status':
          aVal = statusOptions.indexOf(a.status as BrandStatus)
          bVal = statusOptions.indexOf(b.status as BrandStatus)
          break
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredBrands, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const handleFocusEdit = (brand: BrandWithRelations) => {
    setEditingFocusId(brand.id)
    setFocusValue(brand.thisWeekFocus || '')
  }

  const handleFocusSave = (id: string) => {
    updateBrand.mutate({ id, data: { thisWeekFocus: focusValue } })
    setEditingFocusId(null)
  }

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
    >
      {label}
      {sortField === field ? (
        sortDirection === 'asc' ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ArrowDown className="h-4 w-4" />
        )
      ) : (
        <ArrowUpDown className="h-4 w-4 opacity-50" />
      )}
    </button>
  )

  return (
    <section>
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Active Brand Status Board
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-48"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {(brandStageFilter.length > 0 || brandStatusFilter.length > 0) && (
              <Badge variant="primary" className="ml-2">
                {brandStageFilter.length + brandStatusFilter.length}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="mb-4 p-4">
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Stage
              </p>
              <div className="flex flex-wrap gap-2">
                {stageOptions.map((stage) => (
                  <button
                    key={stage}
                    onClick={() => {
                      if (brandStageFilter.includes(stage)) {
                        setBrandStageFilter(brandStageFilter.filter((s) => s !== stage))
                      } else {
                        setBrandStageFilter([...brandStageFilter, stage])
                      }
                    }}
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                      brandStageFilter.includes(stage)
                        ? getStageColor(stage)
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                    )}
                  >
                    {stage}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </p>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      if (brandStatusFilter.includes(status)) {
                        setBrandStatusFilter(brandStatusFilter.filter((s) => s !== status))
                      } else {
                        setBrandStatusFilter([...brandStatusFilter, status])
                      }
                    }}
                    className={cn(
                      'flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors',
                      brandStatusFilter.includes(status)
                        ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                    )}
                  >
                    {getStatusEmoji(status)} {status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {(brandStageFilter.length > 0 || brandStatusFilter.length > 0) && (
              <button
                onClick={() => {
                  setBrandStageFilter([])
                  setBrandStatusFilter([])
                }}
                className="flex items-center gap-1 text-sm text-danger-600 hover:text-danger-700"
              >
                <X className="h-4 w-4" />
                Clear filters
              </button>
            )}
          </div>
        </Card>
      )}

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800/50">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="px-4 py-3 text-left">
                  <SortButton field="name" label="Brand Name" />
                </th>
                <th className="px-4 py-3 text-left">
                  <SortButton field="stage" label="Stage" />
                </th>
                <th className="px-4 py-3 text-right">
                  <SortButton field="monthlyRevenue" label="Monthly Revenue" />
                </th>
                <th className="px-4 py-3 text-right">
                  <SortButton field="monthlyProfit" label="Monthly Profit" />
                </th>
                <th className="px-4 py-3 text-center">
                  <SortButton field="status" label="Status" />
                </th>
                <th className="px-4 py-3 text-left">This Week's Focus</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {sortedBrands.length > 0 ? (
                sortedBrands.map((brand, index) => (
                  <>
                    <tr
                      key={brand.id}
                      className={cn(
                        'transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50',
                        index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/20'
                      )}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              setExpandedBrandId(
                                expandedBrandId === brand.id ? null : brand.id
                              )
                            }
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {expandedBrandId === brand.id ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-sm font-bold text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                            {brand.name.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {brand.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={getStageColor(brand.stage)}>
                          {brand.stage}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatCurrency(Number(brand.monthlyRevenue))}
                          </span>
                          <TrendArrow
                            current={Number(brand.monthlyRevenue)}
                            previous={Number(brand.monthlyRevenue) * 0.9}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatCurrency(Number(brand.monthlyProfit))}
                          </span>
                          <TrendArrow
                            current={Number(brand.monthlyProfit)}
                            previous={Number(brand.monthlyProfit) * 0.85}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusTooltip status={brand.status as BrandStatus} />
                      </td>
                      <td className="px-4 py-3">
                        {editingFocusId === brand.id ? (
                          <input
                            type="text"
                            value={focusValue}
                            onChange={(e) => setFocusValue(e.target.value)}
                            onBlur={() => handleFocusSave(brand.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleFocusSave(brand.id)
                              if (e.key === 'Escape') setEditingFocusId(null)
                            }}
                            className="w-full rounded border border-primary-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800"
                            autoFocus
                          />
                        ) : (
                          <div
                            onClick={() => handleFocusEdit(brand)}
                            className="group flex cursor-pointer items-center gap-2"
                          >
                            <span className="truncate text-sm text-gray-600 dark:text-gray-400 max-w-[200px]">
                              {brand.thisWeekFocus || 'Click to add focus...'}
                            </span>
                            <Edit2 className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/brands/${brand.id}`}>
                            <Button variant="ghost" size="icon-sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon-sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    {/* Expanded Row */}
                    {expandedBrandId === brand.id && (
                      <tr className="bg-gray-50/50 dark:bg-gray-800/30">
                        <td colSpan={7} className="px-4 py-4">
                          <div className="grid gap-4 pl-11 sm:grid-cols-4">
                            <div>
                              <p className="text-xs text-gray-500">Contribution Margin</p>
                              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {Number(brand.contributionMargin).toFixed(1)}%
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Front-End ROAS</p>
                              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {Number(brand.frontEndRoas).toFixed(1)}x
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Back-End LTV</p>
                              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {formatCurrency(Number(brand.backEndLtv))}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Visionary</p>
                              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {brand.visionary?.name || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      {dashboardData?.activeBrands.length === 0
                        ? 'No active brands yet'
                        : 'No brands match your filters'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  )
}
