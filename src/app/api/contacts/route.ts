import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const contacts = await prisma.contact.findMany({
      where: {
        ...(category && { category: category as any }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { role: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      orderBy: [
        { isFavorite: 'desc' },
        { lastContacted: 'desc' },
        { name: 'asc' },
      ],
    })

    return NextResponse.json(contacts)
  } catch (error) {
    console.error('Contacts API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const contact = await prisma.contact.create({
      data: {
        name: body.name,
        role: body.role,
        category: body.category || 'TEAM',
        email: body.email,
        phone: body.phone,
        avatarUrl: body.avatarUrl,
      },
    })

    return NextResponse.json(contact, { status: 201 })
  } catch (error) {
    console.error('Create contact error:', error)
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    )
  }
}
