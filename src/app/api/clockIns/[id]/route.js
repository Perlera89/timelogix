import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(restClockIn ,{ params }) {
  try {
    const {startTime, date, note, activitieId, proyectId } =
    await restClockIn.json();

  let clockin = await prisma.clock_In.update({
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
    },where:{ id : Number(params.id) }
  });
    return NextResponse.json(clockin);
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(error);
  }
}
