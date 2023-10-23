import { NextResponse } from "next/server";
import react from "react";
import { PrismaClient } from "@prisma/client";
import { MdNoCell } from "react-icons/md";

const prisma = new PrismaClient();

export async function GET() {
  let items = await prisma.holiday.findMany();
  await prisma.$disconnect();

  return NextResponse.json(items);
}

export async function POST(restHoliday) {
  const { name, startDate, endDate, type} =
    await restHoliday.json();

  let days = await prisma.holiday.create({
    data: {
      name: name,
      start_date: startDate,
      end_date: endDate,
      type:type
    },
  });

  await prisma.$disconnect();
  return NextResponse.json(days);
}