import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET () {
  const typeProject = await prisma.type_Project.findMany({
    where: {
      is_deleted: false
    }
  })

  await prisma.$disconnect()

  return NextResponse.json(typeProject)
}

export async function POST (restTypeProject) {
  const typeProjectData = await restTypeProject.json()

  const typeTimeOff = await prisma.type_TimeOff.create({
    data: {
      name: typeProjectData.name,
      color: typeProjectData.color,
      is_deleted: false
    }
  })

  await prisma.$disconnect()
  return NextResponse.json(typeTimeOff)
}
