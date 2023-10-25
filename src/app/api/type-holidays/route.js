import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  let typeHolidays = await prisma.type_Holiday.findMany({
    where: {
      is_deleted: false,
    },
  });

  await prisma.$disconnect();

  return NextResponse.json(typeHolidays);
}

export async function POST(restTypeHoliday) {
  const typeHolidayData = await restTypeHoliday.json();

  let typeHoliday = await prisma.type_Holiday.create({
    data: {
      name: typeHolidayData.name,
      color: typeHolidayData.color,
      is_deleted: false,
    },
  });

  await prisma.$disconnect();
  return NextResponse.json(typeHoliday);
}
