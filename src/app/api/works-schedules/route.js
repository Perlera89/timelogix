import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function GET () {
  const getWorkSche = await prisma.work_Schedule.findMany({
    include: {
      schedule: true,
      work: true
    }
  })
  await prisma.$disconnect()
  return NextResponse.json(getWorkSche)
}

export async function POST (restWorkSche) {
  const { workId, scheduleId } =
    await restWorkSche.json()

  const workSchedule = await prisma.work_Schedule.create({
    data: {
      work: {
        connect: {
          id: workId
        }
      },
      schedule: {
        connect: {
          id: scheduleId
        }
      }
    }
  })

  await prisma.$disconnect()
  return NextResponse.json(workSchedule)
}
