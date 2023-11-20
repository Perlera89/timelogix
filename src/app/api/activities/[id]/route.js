import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function PUT (restActivitie, { params }) {
  try {
    const activityData =
    await restActivitie.json()

    const activity = await prisma.activity.update({
      data: {
        name: activityData.name,
        code: activityData.code,
        description: activityData.desctription,
        color: activityData.color,
        is_deleted: false
      },
      where: { id: Number(params.id) }
    })
    return NextResponse.json(activity)
  } catch (error) {
    console.log('error', error)
    return NextResponse.json(error)
  }
}
