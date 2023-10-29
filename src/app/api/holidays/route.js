import { NextResponse } from "next/server";
import react from "react";
import { PrismaClient } from "@prisma/client";
import { MdNoCell } from "react-icons/md";

const prisma = new PrismaClient();

export async function GET() {
  let items = await prisma.holiday.findMany({
    include: {
      type,
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
      start_date: holidayData.startDate,
      end_date: holidayData.endDate || null,
      type: type,
    },
  });

  await prisma.$disconnect();
  return NextResponse.json(days);
}
