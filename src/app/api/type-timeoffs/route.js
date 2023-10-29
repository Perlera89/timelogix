import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  let typeTimeoff = await prisma.type_TimeOff.findMany({
    where: {
      is_deleted: false,
    },
  });

  await prisma.$disconnect();

  return NextResponse.json(typeTimeoff);
}

export async function POST(restTypeTimeoff) {
  const typeTimeoffData = await restTypeTimeoff.json();

  let typeTimeOff = await prisma.type_Holiday.create({
    data: {
      name: typeTimeoffData.name,    
      color: typeTimeoffData.color,
      is_deleted: false,
    },
  });

  await prisma.$disconnect();
  return NextResponse.json(typeTimeOff);
}
