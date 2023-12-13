import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import bcrypt from 'bcrypt'

export async function POST (req) {
  try {
    const userData = await req.json()

    const userFound = await prisma.user
      .findUnique({
        where: {
          email: userData.email
        }
      })
      .then((user) => {
        if (user) {
          return NextResponse.json(user)
        }
      })

    if (userFound) {
      return NextResponse.json(
        {
          message: 'User already exists'
        },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10)
    const newUser = await prisma.user.create({
      data: {
        name: userData.username,
        email: userData.email,
        password: hashedPassword
      }
    })

    const { password: _, ...user } = newUser

    await prisma.$disconnect()
    return NextResponse.json(user)
  } catch (err) {
    return NextResponse.json(
      {
        message: err.message
      },
      { status: 500 }
    )
  }
}
