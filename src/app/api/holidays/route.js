import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET () {
  const items = await prisma.holiday.findMany({
    include: {
      type: true
    }
  })
  await prisma.$disconnect()

  return NextResponse.json(items)
}

export async function POST (restHoliday) {
  const holidayData = await restHoliday.json()

  console.log('holidayData', holidayData)

  const days = await prisma.holiday.create({
    data: {
      name: holidayData.name,
      start_date: holidayData.start_date,
      end_date: holidayData.end_date,
      type: {
        connect: {
          id: Number(holidayData.type_id)
        }
      },
      is_deleted: false
    }
  })

  await prisma.$disconnect()
  return NextResponse.json(days)
}
