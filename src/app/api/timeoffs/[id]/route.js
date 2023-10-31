import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(restTimeOff ,{ params }) {
  try {
    const {startDate, endDate, status, type, note, employeId } =
    await restTimeOff.json();

  let timeOff = await prisma.timeOff.update({
    data: {
      start_date: startDate,
      end_date: endDate,
      status: status,
      note: note,
      type: type,
      employe: {
        connect: {
          id: employeId,
        },
      },
      is_deleted: false,
    },where:{ id:Number(params.id)}
  });
    return NextResponse.json(timeOff);
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(error);
  }
}
