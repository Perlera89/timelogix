import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function PUT (restHoliday, { params }) {
  try {
    const holidayData = await restHoliday.json()
    const query = await prisma.holiday.update({
      where: { id: Number(params.id) },
      data: {
        start_date: holidayData.start_date,
        end_date: holidayData.end_date,
        note: holidayData.note,
        type: {
          connect: {
            id: Number(holidayData.type_id)
          }
        },
        is_deleted: false
      }
    })
    return NextResponse.json(query)
  } catch (error) {
    console.log('error', error)
    return NextResponse.json(error)
  }
}
