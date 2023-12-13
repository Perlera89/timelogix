import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import bcrypt from 'bcrypt'

export async function POST (req) {
  try {
    const userData = await req.json()

    const userFound = await prisma.user.findUnique({
      where: {
        email: userData.email
      }
    })

    if (!userFound) {
      return NextResponse.json(
        {
          message: 'User not found'
        },
        { status: 400 }
      )
    }

    const passwordValid = await bcrypt.compare(
      userData.password,
      userFound.password
    )

    if (!passwordValid) {
      return NextResponse.json(
        {
          message: 'Wrong password'
        },
        { status: 400 }
      )
    }

    const { password: _, ...user } = userFound

    return NextResponse.json(user)
  } catch (err) {
    return NextResponse.json({ status: 500 })
  }
}
