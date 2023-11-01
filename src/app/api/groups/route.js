import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET () {
  const groups = await prisma.group.findMany({
    where: {
      is_deleted: false
    }
  })

  await prisma.$disconnect()

  return NextResponse.json(groups)
}

export async function POST (restGroup) {
  const groupData = await restGroup.json()

  const group = await prisma.group.create({
    data: {
      name: groupData.name,
      color: groupData.color,
      is_deleted: false
    }
  })

  await prisma.$disconnect()
  return NextResponse.json(group)
}
