import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  let getClockIn = await prisma.clock_In.findMany({
    where: {
      is_deleted: false,
    },include:{
        activitie:true,
        proyect:true
    }
  });
  await prisma.$disconnect();
  return NextResponse.json(getClockIn);
}

export async function POST(restClockIn) {
  const { startTime, date, note, activitieId, proyectId } =
    await restClockIn.json();

  let clockin = await prisma.clock_In.create({
    data: {
      start_time: startTime,
      date: date,
      note: note,
      activitie:{
        connect:{
            id:activitieId
        }
      },
      proyect:{
        connect:{
            id:proyectId
        }
      },
      is_deleted: false,
    },
  });

  await prisma.$disconnect();
  return NextResponse.json(clockin);
}