import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function PUT (restProject, { params }) {
  try {
    const projectData = await restProject.json()

    const proyect = await prisma.project.update({
      data: {
        name: projectData.name,
        code: projectData.code,
        type: {
          connect: {
            id: Number(projectData.type_id)
          }
        },
        is_deleted: false
      },
      where: { id: Number(params.id) }
    })
    return NextResponse.json(proyect)
  } catch (error) {
    console.log('error', error)
    return NextResponse.json(error)
  }
}
