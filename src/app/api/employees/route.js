import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function GET () {
  const employees = await prisma.employee.findMany({
    include: {
      group: true,
      clockins: true,
      activity: true
    }
  })
  await prisma.$disconnect()

  return NextResponse.json(employees)
}

export async function POST (restEmployee) {
  const employeeData = await restEmployee.json()

  const employeeCreateData = {
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
    employeeCreateData.activity = {
      connect: {
        id: Number(employeeData.activity_id)
      }
    }
  }

  const employee = await prisma.employee.create({
    data: employeeCreateData
  })

  await prisma.$disconnect()
  return NextResponse.json(employee)
}
