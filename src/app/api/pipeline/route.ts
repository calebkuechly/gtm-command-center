import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [visionaries, brandsByStage] = await Promise.all([
      prisma.visionary.findMany({
        include: {
          brands: true,
        },
        orderBy: [
          { stage: 'asc' },
          { nextActionDate: 'asc' },
        ],
      }),
      prisma.brand.groupBy({
        by: ['stage'],
        _count: true,
      }),
    ])

    const pipeline = {
      visionaries,
      stageBreakdown: brandsByStage.reduce((acc, item) => {
        acc[item.stage] = item._count
        return acc
      }, {} as Record<string, number>),
      summary: {
        totalVisionaries: visionaries.length,
        inNegotiation: visionaries.filter(v => v.stage === 'NEGOTIATION').length,
        signed: visionaries.filter(v => v.stage === 'SIGNED').length,
        passed: visionaries.filter(v => v.stage === 'PASSED').length,
      },
    }

    return NextResponse.json(pipeline)
  } catch (error) {
    console.error('Pipeline API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pipeline' },
      { status: 500 }
    )
  }
}
