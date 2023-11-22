import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function PUT (restEmployee, { params }) {
  try {
    const employeeData = await restEmployee.json()

    // Construir el objeto de datos basado en los campos que se proporcionan
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

    // Verificar si activity_id está presente antes de incluirlo en la consulta
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
