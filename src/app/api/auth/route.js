import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function GET () {
  const employees = await prisma.user.findMany()
  await prisma.$disconnect()

  return NextResponse.json(
    employees.map((employee) => {
      const { password: _, ...user } = employee
      return user
    })
  )
}

export async function POST (restClockIn) {
  const clockinData = await restClockIn.json()

  const clockin = await prisma.clock_In.create({
    data: {
      start_time: clockinData.start_time,
      date: clockinData.date,
      note: clockinData.note,
      employee: {
        connect: {
          id: Number(clockinData.employee_id)
        }
      },
      is_deleted: false
    }
  })

  await prisma.$disconnect()
  return NextResponse.json(clockin)
}
