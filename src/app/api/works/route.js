import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function GET () {
  const getWorks = await prisma.work.findMany({
    where: {
      is_deleted: false
    }
  })
  await prisma.$disconnect()
  return NextResponse.json(getWorks)
}

export async function POST (restWork) {
  const { name } =
    await restWork.json()

  const work = await prisma.work.create({
    data: {
      name,
      is_deleted: false
    }
  })

  await prisma.$disconnect()
  return NextResponse.json(work)
}
