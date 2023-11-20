import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function GET () {
  const typeHolidays = await prisma.type_Holiday.findMany({
    where: {
      is_deleted: false
    }
  })

  await prisma.$disconnect()

  return NextResponse.json(typeHolidays)
}

export async function POST (restTypeHoliday) {
  const typeHolidayData = await restTypeHoliday.json()

  const typeHoliday = await prisma.type_Holiday.create({
    data: {
      name: typeHolidayData.name,
      color: typeHolidayData.color,
      is_deleted: false
    }
  })

  await prisma.$disconnect()
  return NextResponse.json(typeHoliday)
}
