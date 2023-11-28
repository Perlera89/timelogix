import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function PUT (restEmployee, { params }) {
  try {
    const employeeData = await restEmployee.json()
    const data = {
      name: employeeData.name,
      group: {
        connect: {
          id: Number(employeeData.group_id)
        }
      },
      note: employeeData.note,
      is_deleted: false
    }
    if (employeeData.activity_id) {
      data.activity = {
        connect: {
          id: Number(employeeData.activity_id)
        }
      }
    }

    const query = await prisma.employee.update({
      where: { id: Number(params.id) },
      data
    })

    return NextResponse.json(query)
  } catch (error) {
    return NextResponse.json(error)
  }
}
