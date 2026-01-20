import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { EntityType } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const entityType = searchParams.get('entityType') as EntityType
    const entityId = searchParams.get('entityId')

    if (!entityType || !entityId) {
      return NextResponse.json(
        { error: 'entityType and entityId are required' },
        { status: 400 }
      )
    }

    const notes = await prisma.note.findMany({
      where: {
        entityType,
        entityId,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    })

    return NextResponse.json(notes)
  } catch (error) {
    console.error('Get notes error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { entityType, entityId, content, userId } = body

    if (!entityType || !entityId || !content) {
      return NextResponse.json(
        { error: 'entityType, entityId, and content are required' },
        { status: 400 }
      )
    }

    // For now, use a default user if not provided
    // In production, get this from the session
    let finalUserId = userId
    if (!finalUserId) {
      const defaultUser = await prisma.user.findFirst({
        where: { role: 'DIRECTOR' },
      })
      finalUserId = defaultUser?.id
    }

    if (!finalUserId) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 400 }
      )
    }

    const note = await prisma.note.create({
      data: {
        userId: finalUserId,
        entityType,
        entityId,
        content,
      },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    })

    return NextResponse.json(note)
  } catch (error) {
    console.error('Create note error:', error)
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    )
  }
}
