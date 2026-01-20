'use client'

import { motion } from 'framer-motion'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Info } from 'lucide-react'

interface HealthScoreProps {
  score: number
  breakdown?: {
    roas: number
    trend: number
    margin: number
    breakeven: number
    status: number
  }
}

export function HealthScore({ score, breakdown }: HealthScoreProps) {
  const getColor = (score: number) => {
    if (score >= 80) return { ring: 'stroke-emerald-500', text: 'text-emerald-500', bg: 'bg-emerald-500/10' }
    if (score >= 50) return { ring: 'stroke-amber-500', text: 'text-amber-500', bg: 'bg-amber-500/10' }
    return { ring: 'stroke-red-500', text: 'text-red-500', bg: 'bg-red-500/10' }
  }

  const colors = getColor(score)
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`relative inline-flex items-center justify-center ${colors.bg} rounded-full p-2 cursor-help`}>
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                className="stroke-zinc-200 dark:stroke-zinc-700"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                className={colors.ring}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                className={`text-2xl font-bold ${colors.text}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                {score}
              </motion.span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">Health</span>
            </div>
            <Info className="absolute -top-1 -right-1 w-4 h-4 text-zinc-400" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-2">
            <p className="font-semibold">Health Score Breakdown</p>
            {breakdown ? (
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-500">ROAS vs Target (25%)</span>
                  <span>{breakdown.roas}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Revenue Trend (25%)</span>
                  <span>{breakdown.trend}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Profit Margin (20%)</span>
                  <span>{breakdown.margin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Days to Breakeven (15%)</span>
                  <span>{breakdown.breakeven}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Status (15%)</span>
                  <span>{breakdown.status}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-500">
                Weighted score based on ROAS, revenue trend, margin, breakeven, and status.
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
