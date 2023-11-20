import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function PUT (restEmployee, { params }) {
  try {
    const employeeData = await restEmployee.json()
    const query = await prisma.employee.update({
      where: { id: Number(params.id) },
      data: {
        name: employeeData.name,
        group: {
          connect: {
            id: Number(employeeData.group_id)
          }
        },
        activity: {
          connect: {
            id: Number(employeeData.activity_id)
          }
        },
        note: employeeData.note,
        is_deleted: false
      }
    })
    return NextResponse.json(query)
  } catch (error) {
    return NextResponse.json(error)
  }
}
