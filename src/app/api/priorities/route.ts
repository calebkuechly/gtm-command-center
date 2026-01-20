import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfWeek } from 'date-fns'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const weekStartParam = searchParams.get('weekStart')

    const weekStart = weekStartParam
      ? new Date(weekStartParam)
      : startOfWeek(new Date(), { weekStartsOn: 1 })

    const priorities = await prisma.priority.findMany({
      where: {
        weekStartDate: weekStart,
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { order: 'asc' },
      ],
    })

    return NextResponse.json(priorities)
  } catch (error) {
    console.error('Priorities API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch priorities' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Get the next order number for this day
    const existingPriorities = await prisma.priority.count({
      where: {
        dayOfWeek: body.dayOfWeek,
        weekStartDate: new Date(body.weekStartDate),
      },
    })

    const priority = await prisma.priority.create({
      data: {
        userId: body.userId || 'demo-user', // Would come from session
        title: body.title,
        description: body.description,
        dayOfWeek: body.dayOfWeek,
        weekStartDate: new Date(body.weekStartDate),
        order: body.order ?? existingPriorities,
      },
    })

    return NextResponse.json(priority, { status: 201 })
  } catch (error) {
    console.error('Create priority error:', error)
    return NextResponse.json(
      { error: 'Failed to create priority' },
      { status: 500 }
    )
  }
}
