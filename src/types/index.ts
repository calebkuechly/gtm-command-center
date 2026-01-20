import {
  Brand,
  Visionary,
  Metric,
  Priority,
  Contact,
  Decision,
  Alert,
  BrandStage,
  BrandStatus,
  VisionaryStage,
  MetricType,
  DayOfWeek,
  ContactCategory,
  DecisionType,
  AlertType
} from '@prisma/client'

// Re-export Prisma types
export type {
  Brand,
  Visionary,
  Metric,
  Priority,
  Contact,
  Decision,
  Alert
}

export {
  BrandStage,
  BrandStatus,
  VisionaryStage,
  MetricType,
  DayOfWeek,
  ContactCategory,
  DecisionType,
  AlertType
}

// Extended types with relations
export interface BrandWithRelations extends Brand {
  visionary?: Visionary | null
  metrics?: Metric[]
  decisions?: Decision[]
}

export interface VisionaryWithBrands extends Visionary {
  brands?: Brand[]
}

// Dashboard aggregate types
export interface PortfolioPerformance {
  totalRevenue: number
  totalProfit: number
  contributionMargin: number
  activeBrandsCount: number
  revenueChange: number
  profitChange: number
  marginChange: number
}

export interface PipelineStatus {
  visionaryCandidates: number
  inIdeation: number
  inTesting: number
  readyToLaunch: number
  totalPipeline: number
}

export interface WeeklyFocus {
  priorities: Priority[]
  completedCount: number
  totalCount: number
}

export interface DashboardData {
  portfolio: PortfolioPerformance
  pipeline: PipelineStatus
  weeklyFocus: WeeklyFocus
  activeBrands: BrandWithRelations[]
  recentAlerts: Alert[]
  quickStats: QuickStats
  keyObsessions: KeyObsessions
}

export interface QuickStats {
  portfolioMetrics: {
    totalRevenue: number
    totalProfit: number
    blendedRoas: number
    averageLtv: number
    revenueChange: number
    profitChange: number
  }
  teamPerformance: {
    avgCpa: number
    avgCloseRate: number
    avgResponseTime: number
  }
  pipelineHealth: {
    visionariesInPipeline: number
    conceptsInValidation: number
    launchingThisQuarter: number
  }
}

export interface KeyObsessions {
  visionaryPipeline: {
    health: number // 0-100
    nextCall: Date | null
    dealsInNegotiation: Visionary[]
  }
  conceptValidation: {
    brandsInValidation: Brand[]
    nextMilestone: { date: Date; description: string } | null
    goNoGoDecisionDue: { date: Date; brandName: string } | null
  }
  speedToBreakeven: {
    averageDays: number
    fastestLaunch: { brandName: string; days: number } | null
    currentLaunches: { brandName: string; daysElapsed: number; targetDays: number }[]
  }
  roasAndLtv: {
    portfolioAvgRoas: number
    portfolioAvgLtv: number
    targetRoas: number
    targetLtv: number
    brandBreakdown: { brandName: string; roas: number; ltv: number }[]
  }
  keepPassDecisions: {
    brandsInPortfolio: number
    brandsTransitionedToHouse: number
    nextDecisionDue: { date: Date; brandName: string } | null
  }
}

// Trend data for sparklines
export interface TrendData {
  date: string
  value: number
}

export interface MetricWithTrend {
  current: number
  previous: number
  change: number
  trend: TrendData[]
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Form types
export interface CreateBrandInput {
  name: string
  visionaryId?: string
  launchDate?: Date
  stage?: BrandStage
  targetRevenue?: number
  targetMargin?: number
}

export interface UpdateBrandInput {
  name?: string
  stage?: BrandStage
  status?: BrandStatus
  monthlyRevenue?: number
  monthlyProfit?: number
  contributionMargin?: number
  frontEndRoas?: number
  backEndLtv?: number
  thisWeekFocus?: string
}

export interface CreateVisionaryInput {
  name: string
  email?: string
  phone?: string
  company?: string
  industry?: string
  stage?: VisionaryStage
  nextAction?: string
  nextActionDate?: Date
  notes?: string
}

export interface CreatePriorityInput {
  title: string
  description?: string
  dayOfWeek: DayOfWeek
  weekStartDate: Date
  order?: number
}

export interface UpdatePriorityInput {
  title?: string
  description?: string
  completed?: boolean
  order?: number
}

// Filter types
export interface BrandFilters {
  stage?: BrandStage[]
  status?: BrandStatus[]
  search?: string
}

export interface MetricFilters {
  brandId?: string
  metricType?: MetricType[]
  startDate?: Date
  endDate?: Date
}

// Keyboard shortcut types
export interface KeyboardShortcut {
  key: string
  modifiers?: ('ctrl' | 'cmd' | 'shift' | 'alt')[]
  description: string
  action: () => void
  scope?: 'global' | 'list' | 'modal'
}

// Theme types
export type Theme = 'light' | 'dark' | 'system'

// Notification types
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}
