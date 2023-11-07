import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET () {
  const getTimeOff = await prisma.timeOff.findMany({
    include: {
      employee: true,
      type: true
    }
  })

  await prisma.$disconnect()
  return NextResponse.json(getTimeOff)
}

export async function POST (restTimeOff) {
  const timeoffData = await restTimeOff.json()

  const timeOff = await prisma.timeOff.create({
    data: {
      start_date: timeoffData.start_date,
      end_date: timeoffData.end_date,
      status: timeoffData.status,
      note: timeoffData.note,
      type: {
        connect: {
          id: timeoffData.type_id
        }
      },
      employee: {
        connect: {
          id: timeoffData.employee_id
        }
      },
      is_deleted: false
    }
  })

  await prisma.$disconnect()
  return NextResponse.json(timeOff)
}
