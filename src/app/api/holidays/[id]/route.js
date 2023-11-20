import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function PUT (restTimeOff, { params }) {
  try {
    const timeoffData = await restTimeOff.json()
    const query = await prisma.timeOff.update({
      where: { id: Number(params.id) },
      data: {
        start_date: timeoffData.start_date,
        end_date: timeoffData.end_date,
        status: timeoffData.status,
        note: timeoffData.note,
        type: {
          connect: {
            id: Number(timeoffData.type_id)
          }
        },
        employe: {
          connect: {
            id: timeoffData.employe_id
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
