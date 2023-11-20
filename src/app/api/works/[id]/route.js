import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function PUT (restWork, { params }) {
  try {
    const { name } =
    await restWork.json()

    const work = await prisma.work.update({
      data: {
        name,
        is_deleted: false
      },
      where: { id: Number(params.id) }
    })
    return NextResponse.json(work)
  } catch (error) {
    console.log('error', error)
    return NextResponse.json(error)
  }
}
