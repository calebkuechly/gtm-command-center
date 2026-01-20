import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id: params.id },
      include: {
        visionary: true,
        metrics: {
          orderBy: { date: 'desc' },
          take: 90,
        },
        decisions: {
          orderBy: { decisionDate: 'desc' },
        },
      },
    })

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(brand)
  } catch (error) {
    console.error('Get brand error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brand' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // Calculate status based on performance
    let status = body.status
    if (body.monthlyRevenue !== undefined || body.contributionMargin !== undefined) {
      const brand = await prisma.brand.findUnique({
        where: { id: params.id },
        select: { targetRevenue: true, targetMargin: true },
      })

      if (brand) {
        const revenue = body.monthlyRevenue ?? 0
        const margin = body.contributionMargin ?? 0
        const targetRevenue = Number(brand.targetRevenue)
        const targetMargin = Number(brand.targetMargin)

        const revenueRatio = targetRevenue > 0 ? revenue / targetRevenue : 1
        const marginOk = margin >= targetMargin

        if (revenueRatio >= 1 && marginOk) {
          status = 'ON_TRACK'
        } else if (revenueRatio >= 0.8 || (margin >= targetMargin * 0.75 && margin < targetMargin)) {
          status = 'NEEDS_ATTENTION'
        } else if (revenueRatio < 0.8 || margin < targetMargin * 0.75) {
          status = 'CRITICAL'
        }
      }
    }

    const updatedBrand = await prisma.brand.update({
      where: { id: params.id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.stage !== undefined && { stage: body.stage }),
        ...(status !== undefined && { status }),
        ...(body.monthlyRevenue !== undefined && { monthlyRevenue: body.monthlyRevenue }),
        ...(body.monthlyProfit !== undefined && { monthlyProfit: body.monthlyProfit }),
        ...(body.contributionMargin !== undefined && { contributionMargin: body.contributionMargin }),
        ...(body.frontEndRoas !== undefined && { frontEndRoas: body.frontEndRoas }),
        ...(body.backEndLtv !== undefined && { backEndLtv: body.backEndLtv }),
        ...(body.thisWeekFocus !== undefined && { thisWeekFocus: body.thisWeekFocus }),
        ...(body.daysToBreakeven !== undefined && { daysToBreakeven: body.daysToBreakeven }),
      },
      include: {
        visionary: true,
      },
    })

    return NextResponse.json(updatedBrand)
  } catch (error) {
    console.error('Update brand error:', error)
    return NextResponse.json(
      { error: 'Failed to update brand' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.brand.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete brand error:', error)
    return NextResponse.json(
      { error: 'Failed to delete brand' },
      { status: 500 }
    )
  }
}
