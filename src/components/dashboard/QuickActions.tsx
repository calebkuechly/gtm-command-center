'use client'

import Link from 'next/link'
import { Card } from '@/components/ui'
import { useDashboardStore } from '@/store'
import { formatCurrency } from '@/lib/utils'
import {
  LayoutDashboard,
  GitBranch,
  BarChart3,
  Users,
  Building2,
  PlayCircle,
  Cog,
  CalendarDays,
  UserCircle,
  FolderOpen,
  GraduationCap,
  FileText,
  Bookmark,
} from 'lucide-react'

interface QuickActionCardProps {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  metric?: string
  color?: 'blue' | 'green' | 'purple'
}

function QuickActionCard({
  title,
  description,
  icon: Icon,
  href,
  metric,
  color = 'blue',
}: QuickActionCardProps) {
  const colorClasses = {
    blue: 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400',
    green: 'bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400',
    purple: 'bg-secondary-100 text-secondary-600 dark:bg-secondary-900/30 dark:text-secondary-400',
  }

  return (
    <Link href={href}>
      <Card hover className="h-full p-4">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${colorClasses[color]}`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {description}
            </p>
            {metric && (
              <p className="mt-2 text-sm font-medium text-primary-600 dark:text-primary-400">
                {metric}
              </p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}

export function QuickActions() {
  const { dashboardData } = useDashboardStore()

  const strategicActions = [
    {
      title: 'Portfolio Dashboard',
      description: 'Full overview of all active brands and metrics',
      icon: LayoutDashboard,
      href: '/portfolio',
      metric: formatCurrency(dashboardData?.portfolio.totalRevenue || 0, true) + ' MTD Revenue',
    },
    {
      title: 'Brand Pipeline',
      description: 'Track visionaries through the funnel',
      icon: GitBranch,
      href: '/pipeline',
      metric: `${dashboardData?.pipeline.totalPipeline || 0} in pipeline`,
    },
    {
      title: 'Performance Metrics',
      description: 'Deep dive into ROAS, LTV, and KPIs',
      icon: BarChart3,
      href: '/metrics',
    },
    {
      title: 'Visionary Candidates',
      description: 'Potential brand partners to evaluate',
      icon: Users,
      href: '/visionaries',
      metric: `${dashboardData?.pipeline.visionaryCandidates || 0} candidates`,
    },
  ]

  const operationalActions = [
    {
      title: 'Active Brands',
      description: 'Manage currently running brands',
      icon: Building2,
      href: '/brands',
      metric: `${dashboardData?.portfolio.activeBrandsCount || 0} active`,
    },
    {
      title: 'Launch Playbooks',
      description: 'Step-by-step launch processes',
      icon: PlayCircle,
      href: '/playbooks',
    },
    {
      title: 'Systems & SOPs',
      description: 'Operational procedures and tools',
      icon: Cog,
      href: '/systems',
    },
    {
      title: 'Weekly Planning',
      description: "Plan and track this week's priorities",
      icon: CalendarDays,
      href: '/weekly',
    },
  ]

  const teamActions = [
    {
      title: 'Team Directory',
      description: 'Your GTM team members',
      icon: UserCircle,
      href: '/team',
      metric: '12 team members',
    },
    {
      title: 'Content Hub',
      description: 'Marketing assets and content',
      icon: FolderOpen,
      href: '/content',
    },
    {
      title: 'Training Vault',
      description: 'Team training and development',
      icon: GraduationCap,
      href: '/training',
    },
    {
      title: 'Templates',
      description: 'Reusable documents and frameworks',
      icon: FileText,
      href: '/templates',
    },
    {
      title: 'Resources',
      description: 'External tools and references',
      icon: Bookmark,
      href: '/resources',
    },
  ]

  return (
    <section>
      <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
        Quick Actions
      </h2>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Strategic Column */}
        <div>
          <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-primary-600 dark:text-primary-400">
            Strategic
          </h3>
          <div className="space-y-3">
            {strategicActions.map((action) => (
              <QuickActionCard key={action.title} {...action} color="blue" />
            ))}
          </div>
        </div>

        {/* Operational Column */}
        <div>
          <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-success-600 dark:text-success-400">
            Operational
          </h3>
          <div className="space-y-3">
            {operationalActions.map((action) => (
              <QuickActionCard key={action.title} {...action} color="green" />
            ))}
          </div>
        </div>

        {/* Team & Resources Column */}
        <div>
          <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-secondary-600 dark:text-secondary-400">
            Team & Resources
          </h3>
          <div className="space-y-3">
            {teamActions.map((action) => (
              <QuickActionCard key={action.title} {...action} color="purple" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
