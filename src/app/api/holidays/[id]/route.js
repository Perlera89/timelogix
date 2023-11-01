import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export async function PUT (restHoliday, { params }) {
  try {
    const holidayData = await restHoliday.json()
    const query = await prisma.holiday.update({
      where: { id: Number(params.id) },
      data: {
        name: holidayData.name,
        type: {
          connect: {
            id: Number(holidayData.type_id)
          }
        },
        start_date: holidayData.start_date,
        end_date: holidayData.end_date
      }
    })
    return NextResponse.json(query)
  } catch (error) {
    console.log('error', error)
    return NextResponse.json(error)
  }
}
