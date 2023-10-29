import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  let getTimeOff = await prisma.timeOff.findMany({
    include: {
      employe: true,
      type: true,
    },
  });

  await prisma.$disconnect();
  return NextResponse.json(getTimeOff);
}

export async function POST(restTimeOff) {
  const { startDate, endDate, status, type, note, employeId } =
    await restTimeOff.json();

  let timeOff = await prisma.timeOff.create({
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
    },
  });

  await prisma.$disconnect();
  return NextResponse.json(timeOff);
}
