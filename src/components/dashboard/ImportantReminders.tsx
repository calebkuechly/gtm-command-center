'use client'

import { useState } from 'react'
import { Card, Progress, Badge, Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui'
import { formatCurrency, cn } from '@/lib/utils'
import {
  ChevronDown,
  ChevronRight,
  Target,
  Scale,
  Wallet,
  Info,
  Calendar,
} from 'lucide-react'

interface CollapsibleSectionProps {
  title: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  defaultOpen?: boolean
}

function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-gray-100 last:border-b-0 dark:border-gray-800">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50"
      >
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {title}
          </span>
        </div>
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-400" />
        )}
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  )
}

function InfoTooltip({ content }: { content: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Info className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function ImportantReminders() {
  // Demo data - would come from API
  const milestones = {
    ninetyDay: { target: 100000, current: 75000, daysRemaining: 45 },
    sixMonth: { target: 500000, current: 280000, daysRemaining: 120 },
    twelveMonth: { target: 1200000, current: 450000, daysRemaining: 270 },
  }

  const budgets = {
    annual: { allocated: 500000, spent: 180000 },
    perBrandLaunch: 25000,
    hiring: { allocated: 100000, remaining: 65000 },
  }

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Important Reminders
        </h3>
      </div>

      {/* Performance Milestones */}
      <CollapsibleSection title="Performance Milestones" icon={Target}>
        <div className="space-y-4">
          {/* 90-Day Goal */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  90-Day Revenue
                </span>
                <InfoTooltip content="Target: Reach $100K MRR within 90 days of launch" />
              </div>
              <Badge
                variant={
                  milestones.ninetyDay.current >= milestones.ninetyDay.target * 0.75
                    ? 'success'
                    : 'warning'
                }
              >
                {milestones.ninetyDay.daysRemaining}d left
              </Badge>
            </div>
            <Progress
              value={(milestones.ninetyDay.current / milestones.ninetyDay.target) * 100}
              className="h-2"
              indicatorClassName="bg-success-500"
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>{formatCurrency(milestones.ninetyDay.current)}</span>
              <span>{formatCurrency(milestones.ninetyDay.target)}</span>
            </div>
          </div>

          {/* 6-Month Goal */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  6-Month Revenue
                </span>
                <InfoTooltip content="Target: Reach $500K MRR by month 6" />
              </div>
              <span className="text-xs text-gray-500">
                {milestones.sixMonth.daysRemaining}d left
              </span>
            </div>
            <Progress
              value={(milestones.sixMonth.current / milestones.sixMonth.target) * 100}
              className="h-2"
              indicatorClassName="bg-primary-500"
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>{formatCurrency(milestones.sixMonth.current)}</span>
              <span>{formatCurrency(milestones.sixMonth.target)}</span>
            </div>
          </div>

          {/* 12-Month Goal */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  12-Month Revenue
                </span>
                <InfoTooltip content="Target: Reach $1.2M ARR by end of year" />
              </div>
              <span className="text-xs text-gray-500">
                {milestones.twelveMonth.daysRemaining}d left
              </span>
            </div>
            <Progress
              value={(milestones.twelveMonth.current / milestones.twelveMonth.target) * 100}
              className="h-2"
              indicatorClassName="bg-secondary-500"
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>{formatCurrency(milestones.twelveMonth.current)}</span>
              <span>{formatCurrency(milestones.twelveMonth.target)}</span>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Decision Frameworks */}
      <CollapsibleSection title="Decision Frameworks" icon={Scale}>
        <div className="space-y-3">
          {/* Keep Criteria */}
          <div className="rounded-lg bg-success-50 p-3 dark:bg-success-900/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-success-800 dark:text-success-200">
                KEEP Criteria
              </span>
              <InfoTooltip content="Brands meeting these criteria should remain in active portfolio" />
            </div>
            <ul className="mt-2 space-y-1 text-xs text-success-700 dark:text-success-300">
              <li>• ROAS &gt; 2.5x consistently</li>
              <li>• Contribution margin &gt; 20%</li>
              <li>• Growing MoM revenue</li>
            </ul>
          </div>

          {/* Pass Criteria */}
          <div className="rounded-lg bg-danger-50 p-3 dark:bg-danger-900/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-danger-800 dark:text-danger-200">
                PASS Criteria
              </span>
              <InfoTooltip content="Brands meeting these criteria should be discontinued" />
            </div>
            <ul className="mt-2 space-y-1 text-xs text-danger-700 dark:text-danger-300">
              <li>• ROAS &lt; 1.5x for 3+ months</li>
              <li>• Declining revenue trend</li>
              <li>• No path to profitability</li>
            </ul>
          </div>

          {/* Profit Share Table */}
          <div className="rounded-lg border border-gray-100 p-3 dark:border-gray-800">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Profit Share Structure
            </span>
            <table className="mt-2 w-full text-xs">
              <tbody>
                <tr className="border-b border-gray-50 dark:border-gray-800">
                  <td className="py-1 text-gray-500">Year 1</td>
                  <td className="py-1 text-right font-medium">50/50</td>
                </tr>
                <tr className="border-b border-gray-50 dark:border-gray-800">
                  <td className="py-1 text-gray-500">Year 2</td>
                  <td className="py-1 text-right font-medium">60/40</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-500">Year 3+</td>
                  <td className="py-1 text-right font-medium">70/30</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </CollapsibleSection>

      {/* Budget Authority */}
      <CollapsibleSection title="Budget Authority" icon={Wallet}>
        <div className="space-y-3">
          {/* Annual Budget */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Annual Budget
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {formatCurrency(budgets.annual.allocated)}
              </span>
            </div>
            <Progress
              value={(budgets.annual.spent / budgets.annual.allocated) * 100}
              className="h-2"
              indicatorClassName={cn(
                budgets.annual.spent / budgets.annual.allocated > 0.75
                  ? 'bg-warning-500'
                  : 'bg-primary-500'
              )}
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>Spent: {formatCurrency(budgets.annual.spent)}</span>
              <span>
                Remaining: {formatCurrency(budgets.annual.allocated - budgets.annual.spent)}
              </span>
            </div>
          </div>

          {/* Per Brand Launch */}
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Budget per Brand Launch
              </span>
              <InfoTooltip content="Maximum approved spend for launching a new brand" />
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatCurrency(budgets.perBrandLaunch)}
            </span>
          </div>

          {/* Hiring Budget */}
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Hiring Budget Remaining
              </span>
              <InfoTooltip content="Available budget for new team hires" />
            </div>
            <span className="text-sm font-semibold text-success-600">
              {formatCurrency(budgets.hiring.remaining)}
            </span>
          </div>
        </div>
      </CollapsibleSection>
    </Card>
  )
}
