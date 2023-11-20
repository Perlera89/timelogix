import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function GET () {
  const getProjects = await prisma.project.findMany({
    include: {
      type: true
    }
  })
  await prisma.$disconnect()
  return NextResponse.json(getProjects)
}

export async function POST (restProject) {
  const projectData = await restProject.json()

  const proyect = await prisma.project.create({
    data: {
      name: projectData.name,
      code: projectData.code,
      type: {
        connect: {
          id: projectData.type_id
        }
      },
      is_deleted: false
    }
  })

  await prisma.$disconnect()
  return NextResponse.json(proyect)
}
