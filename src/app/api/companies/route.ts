import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { industry: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const companies = await prisma.company.findMany({
      where,
      include: {
        contacts: true,
        _count: {
          select: {
            contacts: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(companies)
  } catch (error) {
    console.error('Error fetching companies:', error)
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, industry, description, website, projects, keyPersonnel, headquarters } = body

    const company = await prisma.company.create({
      data: {
        name,
        industry,
        description,
        website,
        projects: projects ? JSON.stringify(projects) : null,
        keyPersonnel: keyPersonnel ? JSON.stringify(keyPersonnel) : null,
        headquarters
      },
      include: {
        contacts: true,
        _count: {
          select: {
            contacts: true
          }
        }
      }
    })

    return NextResponse.json(company, { status: 201 })
  } catch (error) {
    console.error('Error creating company:', error)
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 })
  }
}