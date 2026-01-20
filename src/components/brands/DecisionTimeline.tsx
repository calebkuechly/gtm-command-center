'use client'

import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, XCircle, Home } from 'lucide-react'

interface Decision {
  id: string
  decisionType: 'KEEP' | 'PASS' | 'TRANSITION_HOUSE'
  decisionDate: string
  reasoning?: string | null
}

interface DecisionTimelineProps {
  decisions: Decision[]
}

export function DecisionTimeline({ decisions }: DecisionTimelineProps) {
  const getDecisionIcon = (type: Decision['decisionType']) => {
    switch (type) {
      case 'KEEP':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      case 'PASS':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'TRANSITION_HOUSE':
        return <Home className="w-5 h-5 text-amber-500" />
    }
  }

  const getDecisionLabel = (type: Decision['decisionType']) => {
    switch (type) {
      case 'KEEP':
        return 'Keep'
      case 'PASS':
        return 'Pass'
      case 'TRANSITION_HOUSE':
        return 'House'
    }
  }

  const getDecisionColor = (type: Decision['decisionType']) => {
    switch (type) {
      case 'KEEP':
        return 'bg-emerald-500'
      case 'PASS':
        return 'bg-red-500'
      case 'TRANSITION_HOUSE':
        return 'bg-amber-500'
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Decision History</CardTitle>
      </CardHeader>
      <CardContent>
        {decisions.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-4">No decisions recorded yet</p>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-zinc-200 dark:bg-zinc-700" />

            <ul className="space-y-4">
              {decisions.map((decision, index) => (
                <li key={decision.id} className="relative flex gap-3">
                  {/* Timeline dot */}
                  <div className={`relative z-10 w-5 h-5 rounded-full ${getDecisionColor(decision.decisionType)} flex items-center justify-center`}>
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>

                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {getDecisionLabel(decision.decisionType)}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {format(new Date(decision.decisionDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                    {decision.reasoning && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 italic">
                        "{decision.reasoning}"
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
