import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function PUT (restProyect, { params }) {
  try {
    const { name, code, type, activitieId } =
    await restProyect.json()

    const proyect = await prisma.proyect.update({
      data: {
        name,
        code,
        type,
        activitie: {
          connect: {
            id: activitieId
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
