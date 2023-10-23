import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  let getEmpAct = await prisma.employe_Activitie.findMany({
    include:{
        activitie:true,
        employe:true
    }
  });
  await prisma.$disconnect();
  return NextResponse.json(getEmpAct);
}

export async function POST(restEmpAct) {
  const {employeId, activitieId} =
    await restEmpAct.json();

  let proyect = await prisma.employe_Activitie.create({
    data: {
      activitie:{
        connect:{
            id:activitieId
        },
      },
      employe:{
        connect:{
            id:employeId
        },
      },
    }
  });

  await prisma.$disconnect();
  return NextResponse.json(proyect);
}