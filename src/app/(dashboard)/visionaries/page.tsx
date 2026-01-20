'use client'

import { useQuery } from '@tanstack/react-query'
import { Users, Mail, Phone, Calendar, MessageSquare, ExternalLink } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'

interface Visionary {
  id: string
  name: string
  email: string
  phone: string | null
  stage: string
  source: string | null
  nextActionDate: string | null
  notes: string | null
  createdAt: string
}

async function fetchVisionaries() {
  const res = await fetch('/api/visionaries')
  return res.json()
}

const stageConfig: Record<string, { label: string; color: string }> = {
  INITIAL_CONTACT: { label: 'Initial Contact', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  DISCOVERY_CALL: { label: 'Discovery Call', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  EVALUATION: { label: 'Evaluation', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
  NEGOTIATION: { label: 'Negotiation', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
  SIGNED: { label: 'Signed', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
  PASSED: { label: 'Passed', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
}

export default function VisionariesPage() {
  const { data: visionaries, isLoading } = useQuery<Visionary[]>({
    queryKey: ['visionaries'],
    queryFn: fetchVisionaries,
  })

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-gray-200 dark:bg-gray-800" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const activeVisionaries = visionaries?.filter(v => !['SIGNED', 'PASSED'].includes(v.stage)) || []
  const signedVisionaries = visionaries?.filter(v => v.stage === 'SIGNED') || []

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Visionaries</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your visionary pipeline and relationships
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Active</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeVisionaries.length}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">In Discovery</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {visionaries?.filter(v => v.stage === 'DISCOVERY_CALL').length || 0}
          </p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">In Negotiation</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {visionaries?.filter(v => v.stage === 'NEGOTIATION').length || 0}
          </p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Signed</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{signedVisionaries.length}</p>
        </div>
      </div>

      {/* Active Visionaries */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Active Pipeline</h2>
        <div className="space-y-4">
          {activeVisionaries.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm dark:bg-gray-900">
              <Users className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
              <p className="mt-4 text-gray-500 dark:text-gray-400">No active visionaries in pipeline</p>
            </div>
          ) : (
            activeVisionaries.map((visionary) => (
              <div
                key={visionary.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{visionary.name}</h3>
                      <span className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        stageConfig[visionary.stage]?.color
                      )}>
                        {stageConfig[visionary.stage]?.label || visionary.stage}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <a href={`mailto:${visionary.email}`} className="flex items-center gap-1 hover:text-primary-600">
                        <Mail className="h-4 w-4" />
                        {visionary.email}
                      </a>
                      {visionary.phone && (
                        <a href={`tel:${visionary.phone}`} className="flex items-center gap-1 hover:text-primary-600">
                          <Phone className="h-4 w-4" />
                          {visionary.phone}
                        </a>
                      )}
                      {visionary.source && (
                        <span className="flex items-center gap-1">
                          <ExternalLink className="h-4 w-4" />
                          {visionary.source}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {visionary.nextActionDate && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Next Action</p>
                        <p className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white">
                          <Calendar className="h-4 w-4" />
                          {formatDate(new Date(visionary.nextActionDate))}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {visionary.notes && (
                  <div className="mt-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                    <p className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <MessageSquare className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      {visionary.notes}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Signed Visionaries */}
      {signedVisionaries.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Signed Partners</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {signedVisionaries.map((visionary) => (
              <div
                key={visionary.id}
                className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-900/20"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white">{visionary.name}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{visionary.email}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
