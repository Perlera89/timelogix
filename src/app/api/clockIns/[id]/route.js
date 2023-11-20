import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function PUT (restClockIn, { params }) {
  try {
    const { startTime, date, note, activitieId, proyectId } =
    await restClockIn.json()

    const clockin = await prisma.clock_In.update({
      data: {
        start_time: startTime,
        date,
        note,
        activitie: {
          connect: {
            id: activitieId
          }
        },
        proyect: {
          connect: {
            id: proyectId
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
