import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic()

// Simple in-memory cache (in production, use Redis or similar)
const cache = new Map<string, { data: string; timestamp: number }>()
const CACHE_TTL = 4 * 60 * 60 * 1000 // 4 hours

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { brand, metrics, forceRefresh } = body

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand data is required' },
        { status: 400 }
      )
    }

    const cacheKey = `briefing-${brand.id}`

    // Check cache unless force refresh
    if (!forceRefresh) {
      const cached = cache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return NextResponse.json({ briefing: cached.data, cached: true })
      }
    }

    // Prepare metrics summary
    const revenueMetrics = metrics
      ?.filter((m: { metricType: string }) => m.metricType === 'REVENUE')
      ?.slice(0, 30) || []

    const recentRevenue = revenueMetrics.slice(0, 7).reduce((sum: number, m: { value: number }) => sum + Number(m.value), 0)
    const previousRevenue = revenueMetrics.slice(7, 14).reduce((sum: number, m: { value: number }) => sum + Number(m.value), 0)
    const revenueTrend = previousRevenue > 0
      ? ((recentRevenue - previousRevenue) / previousRevenue * 100).toFixed(1)
      : '0'

    const prompt = `You are a GTM analyst for a coaching/info product portfolio. Analyze this brand's performance and provide actionable insights.

BRAND: ${brand.name}
STAGE: ${brand.stage}
STATUS: ${brand.status}

CURRENT METRICS:
- Monthly Revenue: $${Number(brand.monthlyRevenue).toLocaleString()}
- Monthly Profit: $${Number(brand.monthlyProfit).toLocaleString()}
- Contribution Margin: ${brand.contributionMargin}%
- Front-End ROAS: ${brand.frontEndRoas}x
- Back-End LTV: $${Number(brand.backEndLtv).toLocaleString()}
- Days to Breakeven: ${brand.daysToBreakeven || 'N/A'}

7-DAY REVENUE TREND: ${revenueTrend}% vs previous week

THIS WEEK'S FOCUS: ${brand.thisWeekFocus || 'Not set'}

Provide a brief analysis with exactly 4 bullet points:
1. What's working well (be specific with numbers)
2. What needs attention (be specific)
3. One recommended action for this week
4. One risk to monitor

Keep each bullet to 1-2 sentences max. Be direct and actionable. Do not use headers or formatting, just the 4 bullet points starting with "•".`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const briefing = message.content[0].type === 'text'
      ? message.content[0].text
      : ''

    // Cache the response
    cache.set(cacheKey, { data: briefing, timestamp: Date.now() })

    return NextResponse.json({ briefing, cached: false })
  } catch (error) {
    console.error('AI briefing error:', error)

    // Return a fallback response if AI fails
    return NextResponse.json({
      briefing: '• Unable to generate AI insights at this time.\n• Please check your API key configuration.\n• Try refreshing in a few minutes.\n• Contact support if the issue persists.',
      cached: false,
      error: true,
    })
  }
}
