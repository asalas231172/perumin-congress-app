import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    let where: any = {}

    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 1)

      where.startTime = {
        gte: startDate,
        lt: endDate
      }
    }

    if (status) {
      where.status = status
    }

    if (type) {
      where.type = type
    }

    const meetings = await prisma.meeting.findMany({
      where,
      include: {
        participants: {
          include: {
            contact: {
              include: {
                company: true
              }
            }
          }
        },
        reminders: true
      },
      orderBy: {
        startTime: 'asc'
      }
    })

    return NextResponse.json(meetings)
  } catch (error) {
    console.error('Error fetching meetings:', error)
    return NextResponse.json({ error: 'Failed to fetch meetings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      meetingType,
      startTime,
      endTime,
      location,
      keyTopics,
      actionItems,
      participants
    } = body

    const meeting = await prisma.meeting.create({
      data: {
        title,
        description,
        meetingType,
        status: 'SCHEDULED',
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        location,
        keyTopics: keyTopics ? JSON.stringify(keyTopics) : null,
        actionItems: actionItems ? JSON.stringify(actionItems) : null,
        participants: {
          create: participants?.map((p: any) => ({
            contactId: p.contactId
          })) || []
        }
      },
      include: {
        participants: {
          include: {
            contact: {
              include: {
                company: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(meeting, { status: 201 })
  } catch (error) {
    console.error('Error creating meeting:', error)
    return NextResponse.json({ error: 'Failed to create meeting' }, { status: 500 })
  }
}