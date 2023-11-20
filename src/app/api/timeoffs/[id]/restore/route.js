import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function PUT (restTimeoff, { params }) {
  try {
    const query = await prisma.timeOff.update({
      where: { id: Number(params.id) },
      data: {
        is_deleted: false
      }
    })
    return NextResponse.json(query)
  } catch (error) {
    console.log('error', error)
    return NextResponse.json(error)
  }
}
