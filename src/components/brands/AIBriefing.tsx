'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { RefreshCw, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface BrandData {
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
}

interface AIBriefingProps {
  brandId: string
  brandData: BrandData
  metrics: Array<{ metricType: string; value: number | string; date: string }>
}

export function AIBriefing({ brandId, brandData, metrics }: AIBriefingProps) {
  const [briefing, setBriefing] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [cached, setCached] = useState(false)

  const fetchBriefing = async (forceRefresh = false) => {
    setLoading(true)
    setError(false)

    try {
      const response = await fetch('/api/ai/briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: brandData,
          metrics,
          forceRefresh,
        }),
      })

      const data = await response.json()

      if (data.error) {
        setError(true)
      }

      setBriefing(data.briefing)
      setCached(data.cached)
    } catch (err) {
      console.error('Failed to fetch briefing:', err)
      setError(true)
      setBriefing('• Unable to generate insights. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Auto-fetch on mount
  useState(() => {
    fetchBriefing()
  })

  const parseBullets = (text: string) => {
    return text
      .split('\n')
      .filter(line => line.trim().startsWith('•'))
      .map(line => line.trim().substring(1).trim())
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-500" />
            <CardTitle className="text-lg font-semibold">AI Insights</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchBriefing(true)}
            disabled={loading}
            className="h-8 px-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        {cached && !loading && (
          <p className="text-xs text-zinc-400">Cached (refreshes every 4h)</p>
        )}
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[85%]" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[75%]" />
            </motion.div>
          ) : briefing ? (
            <motion.ul
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {parseBullets(briefing).map((bullet, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex gap-2 text-sm ${
                    error ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-600 dark:text-zinc-300'
                  }`}
                >
                  <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    index === 0 ? 'bg-emerald-500' :
                    index === 1 ? 'bg-amber-500' :
                    index === 2 ? 'bg-blue-500' :
                    'bg-red-500'
                  }`} />
                  <span>{bullet}</span>
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-6"
            >
              <Button onClick={() => fetchBriefing()} variant="outline">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Insights
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
