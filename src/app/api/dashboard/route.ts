import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfMonth, endOfMonth, subMonths, startOfWeek } from 'date-fns'
import type { DashboardData } from '@/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const now = new Date()
    const startOfCurrentMonth = startOfMonth(now)
    const endOfCurrentMonth = endOfMonth(now)
    const startOfLastMonth = startOfMonth(subMonths(now, 1))
    const endOfLastMonth = endOfMonth(subMonths(now, 1))
    const weekStart = startOfWeek(now, { weekStartsOn: 1 })

    // Parallel data fetching for performance
    const [
      brands,
      visionaries,
      currentMonthMetrics,
      lastMonthMetrics,
      priorities,
      alerts,
      houseBrandsCount,
    ] = await Promise.all([
      // Active brands with relations
      prisma.brand.findMany({
        where: {
          stage: { notIn: ['HOUSE'] },
        },
        include: {
          visionary: true,
        },
        orderBy: { monthlyRevenue: 'desc' },
      }),

      // Visionary pipeline
      prisma.visionary.findMany({
        where: {
          stage: { notIn: ['SIGNED', 'PASSED'] },
        },
        orderBy: { nextActionDate: 'asc' },
      }),

      // Current month metrics
      prisma.metric.groupBy({
        by: ['metricType'],
        where: {
          date: {
            gte: startOfCurrentMonth,
            lte: endOfCurrentMonth,
          },
        },
        _sum: { value: true },
        _avg: { value: true },
      }),

      // Last month metrics for comparison
      prisma.metric.groupBy({
        by: ['metricType'],
        where: {
          date: {
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          },
        },
        _sum: { value: true },
        _avg: { value: true },
      }),

      // This week's priorities
      prisma.priority.findMany({
        where: {
          weekStartDate: weekStart,
        },
        orderBy: [{ dayOfWeek: 'asc' }, { order: 'asc' }],
      }),

      // Recent alerts
      prisma.alert.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),

      // House brands count
      prisma.brand.count({
        where: { stage: 'HOUSE' },
      }),
    ])

    // Calculate portfolio metrics
    const totalRevenue = brands.reduce((sum, b) => sum + Number(b.monthlyRevenue), 0)
    const totalProfit = brands.reduce((sum, b) => sum + Number(b.monthlyProfit), 0)
    const contributionMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0

    // Get last month totals for comparison
    const lastMonthRevenue = lastMonthMetrics.find(m => m.metricType === 'REVENUE')?._sum?.value || 0
    const lastMonthProfit = lastMonthMetrics.find(m => m.metricType === 'PROFIT')?._sum?.value || 0

    // Pipeline counts
    const pipelineStatus = {
      visionaryCandidates: visionaries.filter(v => v.stage === 'INITIAL_CONTACT').length,
      inIdeation: brands.filter(b => b.stage === 'IDEATION').length,
      inTesting: brands.filter(b => b.stage === 'TESTING').length,
      readyToLaunch: brands.filter(b => b.stage === 'LAUNCH').length,
      totalPipeline: visionaries.length,
    }

    // Weekly focus
    const completedPriorities = priorities.filter(p => p.completed).length
    const weeklyFocus = {
      priorities,
      completedCount: completedPriorities,
      totalCount: priorities.length,
    }

    // Quick stats
    const avgRoas = brands.reduce((sum, b) => sum + Number(b.frontEndRoas), 0) / (brands.length || 1)
    const avgLtv = brands.reduce((sum, b) => sum + Number(b.backEndLtv), 0) / (brands.length || 1)
    const avgCpa = currentMonthMetrics.find(m => m.metricType === 'CPA')?._avg?.value || 0
    const avgCloseRate = currentMonthMetrics.find(m => m.metricType === 'CLOSE_RATE')?._avg?.value || 0

    const quickStats = {
      portfolioMetrics: {
        totalRevenue,
        totalProfit,
        blendedRoas: avgRoas,
        averageLtv: avgLtv,
        revenueChange: lastMonthRevenue ? ((totalRevenue - Number(lastMonthRevenue)) / Number(lastMonthRevenue)) * 100 : 0,
        profitChange: lastMonthProfit ? ((totalProfit - Number(lastMonthProfit)) / Number(lastMonthProfit)) * 100 : 0,
      },
      teamPerformance: {
        avgCpa: Number(avgCpa),
        avgCloseRate: Number(avgCloseRate),
        avgResponseTime: 2.5, // Hours - would be calculated from actual data
      },
      pipelineHealth: {
        visionariesInPipeline: pipelineStatus.visionaryCandidates,
        conceptsInValidation: pipelineStatus.inIdeation + pipelineStatus.inTesting,
        launchingThisQuarter: pipelineStatus.readyToLaunch,
      },
    }

    // Key obsessions
    const dealsInNegotiation = visionaries.filter(v => v.stage === 'NEGOTIATION')
    const brandsInValidation = brands.filter(b => b.stage === 'IDEATION' || b.stage === 'TESTING')
    const avgDaysToBreakeven = brands.filter(b => b.daysToBreakeven).reduce((sum, b) => sum + (b.daysToBreakeven || 0), 0) / (brands.filter(b => b.daysToBreakeven).length || 1)

    const keyObsessions = {
      visionaryPipeline: {
        health: Math.min(100, (pipelineStatus.totalPipeline / 10) * 100), // Target 10 visionaries
        nextCall: dealsInNegotiation[0]?.nextActionDate || null,
        dealsInNegotiation,
      },
      conceptValidation: {
        brandsInValidation,
        nextMilestone: null, // Would be calculated from milestones table
        goNoGoDecisionDue: null,
      },
      speedToBreakeven: {
        averageDays: Math.round(avgDaysToBreakeven) || 90,
        fastestLaunch: brands.filter(b => b.daysToBreakeven).sort((a, b) => (a.daysToBreakeven || 999) - (b.daysToBreakeven || 999))[0]
          ? { brandName: brands[0]?.name, days: brands[0]?.daysToBreakeven || 0 }
          : null,
        currentLaunches: brands.filter(b => b.stage === 'LAUNCH').map(b => ({
          brandName: b.name,
          daysElapsed: Math.floor((now.getTime() - (b.launchDate?.getTime() || now.getTime())) / (1000 * 60 * 60 * 24)),
          targetDays: 90,
        })),
      },
      roasAndLtv: {
        portfolioAvgRoas: avgRoas,
        portfolioAvgLtv: avgLtv,
        targetRoas: 3.0,
        targetLtv: 500,
        brandBreakdown: brands.map(b => ({
          brandName: b.name,
          roas: Number(b.frontEndRoas),
          ltv: Number(b.backEndLtv),
        })),
      },
      keepPassDecisions: {
        brandsInPortfolio: brands.filter(b => b.stage === 'PORTFOLIO').length,
        brandsTransitionedToHouse: houseBrandsCount,
        nextDecisionDue: null, // Would be calculated from decisions table
      },
    }

    const dashboardData: DashboardData = {
      portfolio: {
        totalRevenue,
        totalProfit,
        contributionMargin,
        activeBrandsCount: brands.length,
        revenueChange: quickStats.portfolioMetrics.revenueChange,
        profitChange: quickStats.portfolioMetrics.profitChange,
        marginChange: 0,
      },
      pipeline: pipelineStatus,
      weeklyFocus,
      activeBrands: brands,
      recentAlerts: alerts,
      quickStats,
      keyObsessions,
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
