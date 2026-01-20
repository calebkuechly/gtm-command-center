import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const alert = await prisma.alert.update({
      where: { id: params.id },
      data: { isRead: true },
    })

    return NextResponse.json(alert)
  } catch (error) {
    console.error('Mark alert read error:', error)
    return NextResponse.json(
      { error: 'Failed to mark alert as read' },
      { status: 500 }
    )
  }
}
