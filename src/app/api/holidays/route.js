import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  let items = await prisma.holiday.findMany({
    include: {
      type: true,
    },
  });
  await prisma.$disconnect();

  return NextResponse.json(items);
}

export async function POST(restHoliday) {
  const holidayData = await restHoliday.json();

  let days = await prisma.holiday.create({
    data: {
      name: holidayData.name,
      type_id: holidayData.type,
      start_date: holidayData.start_date,
      end_date: holidayData.end_date || holidayData.start_date,
      type: type,
    },
  });

  await prisma.$disconnect();
  return NextResponse.json(days);
}
