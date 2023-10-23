import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  let getSchedule = await prisma.schedule.findMany({
    where: {
      is_deleted: false,
    }
  });
  await prisma.$disconnect();
  return NextResponse.json(getSchedule);
}

export async function POST(restSchedule) {
  const { name, startTime, endTime, note } =
    await restSchedule.json();

  let schedule = await prisma.schedule.create({
    data: {
      name: name,
      start_time: startTime,
      end_time: endTime,
      note: note,
      is_deleted: false,
    },
  });

  await prisma.$disconnect();
  return NextResponse.json(schedule);
}