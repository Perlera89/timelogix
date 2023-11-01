import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT (restHoliday, { params }) {
  try {
    const query = await prisma.holiday.update({
      where: { id: Number(params.id) },
      data: {
        is_deleted: true
      }
    })
    return NextResponse.json(query)
  } catch (error) {
    console.log('error', error)
    return NextResponse.json(error)
  }
}
