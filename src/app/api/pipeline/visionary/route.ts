import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const visionary = await prisma.visionary.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        company: body.company,
        industry: body.industry,
        stage: body.stage || 'INITIAL_CONTACT',
        nextAction: body.nextAction,
        nextActionDate: body.nextActionDate ? new Date(body.nextActionDate) : null,
        notes: body.notes,
      },
    })

    return NextResponse.json(visionary, { status: 201 })
  } catch (error) {
    console.error('Create visionary error:', error)
    return NextResponse.json(
      { error: 'Failed to create visionary' },
      { status: 500 }
    )
  }
}
