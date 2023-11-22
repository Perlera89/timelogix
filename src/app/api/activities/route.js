import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function GET () {
  const getActivities = await prisma.activity.findMany({
    include: {
      employees: true,
      project: true
    }
  })
  await prisma.$disconnect()
  return NextResponse.json(getActivities)
}

export async function POST (restActivitie) {
  const activityData = await restActivitie.json()

  const activitie = await prisma.activity.create({
    data: {
      name: activityData.name,
      code: activityData.code,
      project: {
        connect: {
          id: Number(activityData.project_id)
        }
      },
      description: activityData.description,
      color: activityData.color,
      is_deleted: false
    }
  })

  await prisma.$disconnect()
  return NextResponse.json(activitie)
}
