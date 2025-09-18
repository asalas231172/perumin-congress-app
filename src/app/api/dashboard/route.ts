import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get current date in user's timezone
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfDay = new Date(startOfDay)
    endOfDay.setDate(endOfDay.getDate() + 1)

    // Get all counts
    const [
      totalContacts,
      totalMeetings,
      todaysMeetings,
      totalCompanies,
      upcomingMeetings
    ] = await Promise.all([
      prisma.contact.count(),
      prisma.meeting.count(),
      prisma.meeting.count({
        where: {
          startTime: {
            gte: startOfDay,
            lt: endOfDay
          }
        }
      }),
      prisma.company.count(),
      prisma.meeting.findMany({
        where: {
          startTime: {
            gte: startOfDay,
            lt: endOfDay
          },
          status: 'SCHEDULED'
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
        },
        orderBy: {
          startTime: 'asc'
        }
      })
    ])

    const stats = {
      totalContacts,
      totalMeetings,
      todaysMeetings,
      totalCompanies,
      upcomingMeetings
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 })
  }
}