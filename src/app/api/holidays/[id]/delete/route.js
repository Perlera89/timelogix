import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

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
