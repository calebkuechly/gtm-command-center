'use client'

import { useState } from 'react'
import { Card, Badge, CircularProgress, Button } from '@/components/ui'
import { useDashboardStore } from '@/store'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import {
  ChevronDown,
  ChevronRight,
  Users,
  FlaskConical,
  Zap,
  TrendingUp,
  Scale,
  Calendar,
  Phone,
  ArrowRight,
  Plus,
} from 'lucide-react'

interface AccordionSectionProps {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  badge?: string | number
  badgeVariant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
}

function AccordionSection({
  id,
  title,
  icon: Icon,
  children,
  badge,
  badgeVariant = 'default',
}: AccordionSectionProps) {
  const { expandedSections, toggleSection } = useDashboardStore()
  const isExpanded = expandedSections[id] || false

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => toggleSection(id)}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
            <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </div>
          <span className="font-semibold text-gray-900 dark:text-white">
            {title}
          </span>
          {badge !== undefined && (
            <Badge variant={badgeVariant}>{badge}</Badge>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-gray-100 p-4 dark:border-gray-800 animate-slide-down">
          {children}
        </div>
      )}
    </Card>
  )
}

export function KeyObsessions() {
  const { dashboardData } = useDashboardStore()
  const keyObsessions = dashboardData?.keyObsessions

  return (
    <section>
      <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
        Key Obsessions
      </h2>

      <div className="space-y-4">
        {/* 1. Brand Visionary Pipeline */}
        <AccordionSection
          id="visionary-pipeline"
          title="Brand Visionary Pipeline"
          icon={Users}
          badge={keyObsessions?.visionaryPipeline.dealsInNegotiation.length || 0}
          badgeVariant="primary"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Pipeline Health
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {keyObsessions?.visionaryPipeline.health || 0}%
                </p>
              </div>
              <CircularProgress
                value={keyObsessions?.visionaryPipeline.health || 0}
                size={80}
                label="Health"
              />
            </div>

            {keyObsessions?.visionaryPipeline.nextCall && (
              <div className="flex items-center gap-3 rounded-lg bg-primary-50 p-3 dark:bg-primary-900/20">
                <Calendar className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="text-sm font-medium text-primary-900 dark:text-primary-100">
                    Next Scheduled Call
                  </p>
                  <p className="text-sm text-primary-700 dark:text-primary-300">
                    {formatDate(keyObsessions.visionaryPipeline.nextCall, 'PPp')}
                  </p>
                </div>
              </div>
            )}

            {(keyObsessions?.visionaryPipeline?.dealsInNegotiation?.length ?? 0) > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Deals in Negotiation
                </p>
                <div className="space-y-2">
                  {keyObsessions.visionaryPipeline.dealsInNegotiation.map((deal) => (
                    <div
                      key={deal.id}
                      className="flex items-center justify-between rounded-lg border border-gray-100 p-3 dark:border-gray-800"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {deal.name}
                        </p>
                        <p className="text-sm text-gray-500">{deal.company}</p>
                      </div>
                      <Badge variant="warning">Negotiating</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button variant="outline" className="w-full">
              <Phone className="mr-2 h-4 w-4" />
              Schedule Discovery Call
            </Button>
          </div>
        </AccordionSection>

        {/* 2. Concept Validation */}
        <AccordionSection
          id="concept-validation"
          title="Concept Validation"
          icon={FlaskConical}
          badge={keyObsessions?.conceptValidation.brandsInValidation.length || 0}
        >
          <div className="space-y-4">
            {(keyObsessions?.conceptValidation?.brandsInValidation?.length ?? 0) > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {keyObsessions.conceptValidation.brandsInValidation.map((brand) => (
                  <div
                    key={brand.id}
                    className="rounded-lg border border-gray-100 p-3 dark:border-gray-800"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {brand.name}
                      </span>
                      <Badge
                        variant={
                          brand.stage === 'TESTING' ? 'warning' : 'secondary'
                        }
                      >
                        {brand.stage}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No brands currently in validation
              </p>
            )}

            {keyObsessions?.conceptValidation.nextMilestone && (
              <div className="rounded-lg bg-warning-50 p-3 dark:bg-warning-900/20">
                <p className="text-sm font-medium text-warning-900 dark:text-warning-100">
                  Next Milestone:{' '}
                  {formatDate(keyObsessions.conceptValidation.nextMilestone.date)}
                </p>
                <p className="text-sm text-warning-700 dark:text-warning-300">
                  {keyObsessions.conceptValidation.nextMilestone.description}
                </p>
              </div>
            )}

            <Button variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Validation Criteria
            </Button>
          </div>
        </AccordionSection>

        {/* 3. Speed to Breakeven */}
        <AccordionSection
          id="speed-breakeven"
          title="Speed to Breakeven"
          icon={Zap}
          badge={`${keyObsessions?.speedToBreakeven.averageDays || 0} days avg`}
        >
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Average Days to Breakeven
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {keyObsessions?.speedToBreakeven.averageDays || 0}
                </p>
              </div>
              {keyObsessions?.speedToBreakeven.fastestLaunch && (
                <div className="rounded-lg bg-success-50 p-4 dark:bg-success-900/20">
                  <p className="text-sm text-success-700 dark:text-success-300">
                    Fastest Launch
                  </p>
                  <p className="text-lg font-bold text-success-900 dark:text-success-100">
                    {keyObsessions.speedToBreakeven.fastestLaunch.brandName}
                  </p>
                  <p className="text-sm text-success-600 dark:text-success-400">
                    {keyObsessions.speedToBreakeven.fastestLaunch.days} days
                  </p>
                </div>
              )}
            </div>

            {(keyObsessions?.speedToBreakeven?.currentLaunches?.length ?? 0) > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Launches
                </p>
                <div className="space-y-2">
                  {keyObsessions.speedToBreakeven.currentLaunches.map((launch) => {
                    const progress = Math.min(
                      100,
                      (launch.daysElapsed / launch.targetDays) * 100
                    )
                    return (
                      <div
                        key={launch.brandName}
                        className="rounded-lg border border-gray-100 p-3 dark:border-gray-800"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {launch.brandName}
                          </span>
                          <span className="text-sm text-gray-500">
                            Day {launch.daysElapsed}/{launch.targetDays}
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className={cn(
                              'h-2 rounded-full transition-all',
                              progress < 75
                                ? 'bg-success-500'
                                : progress < 100
                                ? 'bg-warning-500'
                                : 'bg-danger-500'
                            )}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </AccordionSection>

        {/* 4. Front-End ROAS & Back-End LTV */}
        <AccordionSection
          id="roas-ltv"
          title="Front-End ROAS & Back-End LTV"
          icon={TrendingUp}
          badge={`${(keyObsessions?.roasAndLtv.portfolioAvgRoas || 0).toFixed(1)}x ROAS`}
          badgeVariant={
            (keyObsessions?.roasAndLtv.portfolioAvgRoas || 0) >= 3
              ? 'success'
              : 'warning'
          }
        >
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Portfolio Avg ROAS
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {(keyObsessions?.roasAndLtv.portfolioAvgRoas || 0).toFixed(1)}x
                  </p>
                </div>
                <CircularProgress
                  value={Math.min(
                    100,
                    ((keyObsessions?.roasAndLtv.portfolioAvgRoas || 0) /
                      (keyObsessions?.roasAndLtv.targetRoas || 3)) *
                      100
                  )}
                  size={60}
                  strokeWidth={6}
                  showValue={false}
                />
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Portfolio Avg LTV
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(keyObsessions?.roasAndLtv.portfolioAvgLtv || 0)}
                </p>
                <p className="text-xs text-gray-500">
                  Target: {formatCurrency(keyObsessions?.roasAndLtv.targetLtv || 500)}
                </p>
              </div>
            </div>

            {(keyObsessions?.roasAndLtv?.brandBreakdown?.length ?? 0) > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <th className="py-2 text-left font-medium text-gray-500">
                        Brand
                      </th>
                      <th className="py-2 text-right font-medium text-gray-500">
                        ROAS
                      </th>
                      <th className="py-2 text-right font-medium text-gray-500">
                        LTV
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {keyObsessions.roasAndLtv.brandBreakdown.slice(0, 5).map((brand) => (
                      <tr
                        key={brand.brandName}
                        className="border-b border-gray-50 dark:border-gray-800/50"
                      >
                        <td className="py-2 font-medium text-gray-900 dark:text-white">
                          {brand.brandName}
                        </td>
                        <td className="py-2 text-right">
                          <span
                            className={cn(
                              'font-medium',
                              brand.roas >= 3
                                ? 'text-success-600'
                                : 'text-warning-600'
                            )}
                          >
                            {brand.roas.toFixed(1)}x
                          </span>
                        </td>
                        <td className="py-2 text-right text-gray-600 dark:text-gray-400">
                          {formatCurrency(brand.ltv)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </AccordionSection>

        {/* 5. Keep vs Pass Decisions */}
        <AccordionSection
          id="keep-pass"
          title="Keep vs Pass Decisions"
          icon={Scale}
          badge={keyObsessions?.keepPassDecisions.brandsInPortfolio || 0}
        >
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-success-50 p-4 dark:bg-success-900/20">
                <p className="text-sm text-success-700 dark:text-success-300">
                  In Portfolio
                </p>
                <p className="text-2xl font-bold text-success-900 dark:text-success-100">
                  {keyObsessions?.keepPassDecisions.brandsInPortfolio || 0}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Transitioned to House
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {keyObsessions?.keepPassDecisions.brandsTransitionedToHouse || 0}
                </p>
              </div>
              {keyObsessions?.keepPassDecisions.nextDecisionDue && (
                <div className="rounded-lg bg-warning-50 p-4 dark:bg-warning-900/20">
                  <p className="text-sm text-warning-700 dark:text-warning-300">
                    Next Decision Due
                  </p>
                  <p className="text-lg font-bold text-warning-900 dark:text-warning-100">
                    {keyObsessions.keepPassDecisions.nextDecisionDue.brandName}
                  </p>
                  <p className="text-xs text-warning-600">
                    {formatDate(keyObsessions.keepPassDecisions.nextDecisionDue.date)}
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-gray-100 p-3 dark:border-gray-800">
              <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Decision Framework Quick Reference
              </p>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>• Keep: ROAS &gt; 2.5x, Margin &gt; 20%, Growing MoM</li>
                <li>• Pass: ROAS &lt; 1.5x for 3+ months</li>
                <li>• House: Stable but not scaling, margin &lt; 15%</li>
              </ul>
            </div>
          </div>
        </AccordionSection>
      </div>
    </section>
  )
}
