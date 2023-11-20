import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function GET () {
  const getSchedule = await prisma.schedule.findMany({
    where: {
      is_deleted: false
    }
  })
  await prisma.$disconnect()
  return NextResponse.json(getSchedule)
}

export async function POST (restSchedule) {
  const { name, startTime, endTime, note } =
    await restSchedule.json()

  const schedule = await prisma.schedule.create({
    data: {
      name,
      start_time: startTime,
      end_time: endTime,
      note,
      is_deleted: false
    }
  })

  await prisma.$disconnect()
  return NextResponse.json(schedule)
}
