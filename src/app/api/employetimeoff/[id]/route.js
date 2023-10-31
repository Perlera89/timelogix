import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(restEmpTime ,{ params }) {
  try {
    const {employeId, timeId } =
    await restEmpTime.json();

  let empTime = await prisma.employe_TimeOff.update({
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
    },where:{ id:Number(params.id) }
  });
    return NextResponse.json(empTime);
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(error);
  }
}
