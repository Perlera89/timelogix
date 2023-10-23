import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  let getEmpTime = await prisma.employe_TimeOff.findMany({
    include:{
        employe:true,
        timeoff:true
    }
  });
  await prisma.$disconnect();
  return NextResponse.json(getEmpTime);
}

export async function POST(restEmpTime) {
  const {employeId, timeId } =
    await restEmpTime.json();

  let empTime = await prisma.employe_TimeOff.create({
    data: {
      employe:{
        connect:{
            id:employeId
        }
      },
      timeoff:{
        connect:{
            id:timeId
        }
      }
    },
  });

  await prisma.$disconnect();
  return NextResponse.json(empTime);
}