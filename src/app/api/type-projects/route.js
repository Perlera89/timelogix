import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

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

  const typeTimeOff = await prisma.type_Project.create({
    data: {
      name: typeProjectData.name,
      color: typeProjectData.color,
      is_deleted: false
    }
  })

  await prisma.$disconnect()
  return NextResponse.json(typeTimeOff)
}
