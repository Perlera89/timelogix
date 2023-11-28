import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function PUT (restClockIn, { params }) {
  try {
    const clockinData = await restClockIn.json()

    const clockin = await prisma.clock_In.update({
      data: {
        start_time: clockinData.start_time,
        end_time: clockinData.end_time,
        date: clockinData.date,
        note: clockinData.note,
        employee: {
          connect: {
            id: Number(clockinData.employee_id)
          }
        },
        is_deleted: false
      },
      where: { id: Number(params.id) }
    })
    return NextResponse.json(clockin)
  } catch (error) {
    console.log('error', error)
    return NextResponse.json(error)
  }
}
