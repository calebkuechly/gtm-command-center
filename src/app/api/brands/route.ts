import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { BrandStage, BrandStatus } from '@prisma/client'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const stage = searchParams.get('stage')?.split(',') as BrandStage[] | undefined
    const status = searchParams.get('status')?.split(',') as BrandStatus[] | undefined
    const search = searchParams.get('search')

    const brands = await prisma.brand.findMany({
      where: {
        ...(stage?.length && { stage: { in: stage } }),
        ...(status?.length && { status: { in: status } }),
        ...(search && {
          name: { contains: search, mode: 'insensitive' },
        }),
      },
      include: {
        visionary: true,
        metrics: {
          orderBy: { date: 'desc' },
          take: 30,
        },
      },
      orderBy: { monthlyRevenue: 'desc' },
    })

    return NextResponse.json(brands)
  } catch (error) {
    console.error('Brands API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const brand = await prisma.brand.create({
      data: {
        name: body.name,
        visionaryId: body.visionaryId,
        launchDate: body.launchDate ? new Date(body.launchDate) : null,
        stage: body.stage || 'IDEATION',
        targetRevenue: body.targetRevenue || 0,
        targetMargin: body.targetMargin || 20,
      },
      include: {
        visionary: true,
      },
    })

    return NextResponse.json(brand, { status: 201 })
  } catch (error) {
    console.error('Create brand error:', error)
    return NextResponse.json(
      { error: 'Failed to create brand' },
      { status: 500 }
    )
  }
}
