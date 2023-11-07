import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET () {
  const typeTimeoff = await prisma.type_TimeOff.findMany({
    where: {
      is_deleted: false
    }
  })

  await prisma.$disconnect()

  return NextResponse.json(typeTimeoff)
}

export async function POST (restTypeTimeoff) {
  const typeTimeoffData = await restTypeTimeoff.json()

  const typeTimeOff = await prisma.type_TimeOff.create({
    data: {
      name: typeTimeoffData.name,
      color: typeTimeoffData.color,
      is_deleted: false
    }
  })

  await prisma.$disconnect()
  return NextResponse.json(typeTimeOff)
}
