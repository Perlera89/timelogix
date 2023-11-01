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
  const { startDate, endDate, status, type, note, employeId } =
    await restTimeOff.json()

  const timeOff = await prisma.timeOff.create({
    data: {
      start_date: startDate,
      end_date: endDate,
      status,
      note,
      type,
      employee: {
        connect: {
          id: employeId
        }
      },
      is_deleted: false
    }
  })

  await prisma.$disconnect()
  return NextResponse.json(timeOff)
}
