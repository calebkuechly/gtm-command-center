'use client'

import { useQuery } from '@tanstack/react-query'
import { GitBranch, Users, Lightbulb, FlaskConical, Rocket, ArrowRight, Calendar, Phone } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'

interface Visionary {
  id: string
  name: string
  email: string
  stage: string
  nextActionDate: string | null
  notes: string | null
}

interface Brand {
  id: string
  name: string
  stage: string
  status: string
}

async function fetchPipelineData() {
  const [visionariesRes, brandsRes] = await Promise.all([
    fetch('/api/visionaries'),
    fetch('/api/brands'),
  ])

  const visionaries = await visionariesRes.json()
  const brands = await brandsRes.json()

  return { visionaries, brands }
}

const stageConfig = {
  INITIAL_CONTACT: { label: 'Initial Contact', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  DISCOVERY_CALL: { label: 'Discovery Call', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  EVALUATION: { label: 'Evaluation', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
  NEGOTIATION: { label: 'Negotiation', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
  IDEATION: { label: 'Ideation', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300' },
  TESTING: { label: 'Testing', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' },
  LAUNCH: { label: 'Launch', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
}

export default function PipelinePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['pipeline'],
    queryFn: fetchPipelineData,
  })

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 rounded-xl bg-gray-200 dark:bg-gray-800" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const visionaries = data?.visionaries || []
  const brands = data?.brands || []

  const pipelineStages = [
    {
      title: 'Visionary Candidates',
      icon: Users,
      items: visionaries.filter((v: Visionary) => ['INITIAL_CONTACT', 'DISCOVERY_CALL'].includes(v.stage)),
      color: 'border-blue-500',
    },
    {
      title: 'In Evaluation',
      icon: Lightbulb,
      items: visionaries.filter((v: Visionary) => ['EVALUATION', 'NEGOTIATION'].includes(v.stage)),
      color: 'border-yellow-500',
    },
    {
      title: 'Concept Testing',
      icon: FlaskConical,
      items: brands.filter((b: Brand) => ['IDEATION', 'TESTING'].includes(b.stage)),
      color: 'border-purple-500',
    },
    {
      title: 'Ready to Launch',
      icon: Rocket,
      items: brands.filter((b: Brand) => b.stage === 'LAUNCH'),
      color: 'border-green-500',
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pipeline</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track visionaries and brands through the pipeline stages
        </p>
      </div>

      {/* Pipeline Kanban */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {pipelineStages.map((stage) => (
          <div
            key={stage.title}
            className={cn(
              'rounded-xl border-t-4 bg-white p-4 shadow-sm dark:bg-gray-900',
              stage.color
            )}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <stage.icon className="h-5 w-5 text-gray-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">{stage.title}</h3>
              </div>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {stage.items.length}
              </span>
            </div>

            <div className="space-y-3">
              {stage.items.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-400">No items</p>
              ) : (
                stage.items.map((item: Visionary | Brand) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-3 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                  >
                    <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        stageConfig[item.stage as keyof typeof stageConfig]?.color || 'bg-gray-100 text-gray-600'
                      )}>
                        {stageConfig[item.stage as keyof typeof stageConfig]?.label || item.stage}
                      </span>
                      {'nextActionDate' in item && item.nextActionDate && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {formatDate(new Date(item.nextActionDate))}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Flow Visual */}
      <div className="mt-8 hidden items-center justify-center gap-4 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900 lg:flex">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">Contact</p>
        </div>
        <ArrowRight className="h-5 w-5 text-gray-300" />
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
            <Lightbulb className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">Evaluate</p>
        </div>
        <ArrowRight className="h-5 w-5 text-gray-300" />
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
            <FlaskConical className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">Test</p>
        </div>
        <ArrowRight className="h-5 w-5 text-gray-300" />
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <Rocket className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">Launch</p>
        </div>
      </div>
    </div>
  )
}
