import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function PUT (restGroup, { params }) {
  try {
    const groupData = await restGroup.json()
    const query = await prisma.employe.update({
      where: { id: Number(params.id) },
      data: {
        name: groupData.name,
        group: groupData.color
      }
    })
    return NextResponse.json(query)
  } catch (error) {
    console.log('error', error)
    return NextResponse.json(error)
  }
}
