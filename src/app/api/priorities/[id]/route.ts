import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const priority = await prisma.priority.update({
      where: { id: params.id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.completed !== undefined && { completed: body.completed }),
        ...(body.order !== undefined && { order: body.order }),
      },
    })

    return NextResponse.json(priority)
  } catch (error) {
    console.error('Update priority error:', error)
    return NextResponse.json(
      { error: 'Failed to update priority' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.priority.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete priority error:', error)
    return NextResponse.json(
      { error: 'Failed to delete priority' },
      { status: 500 }
    )
  }
}
