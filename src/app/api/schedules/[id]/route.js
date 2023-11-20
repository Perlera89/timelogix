import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function PUT (restSchedule, { params }) {
  try {
    const { name, startTime, endTime, note } =
    await restSchedule.json()

    const schedule = await prisma.schedule.update({
      data: {
        name,
        start_time: startTime,
        end_time: endTime,
        note,
        is_deleted: false
      },
      where: { id: Number(params.id) }
    })
    return NextResponse.json(schedule)
  } catch (error) {
    console.log('error', error)
    return NextResponse.json(error)
  }
}
