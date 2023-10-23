import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  let getWorks = await prisma.work.findMany({
    where: {
      is_deleted: false,
    }
  });
  await prisma.$disconnect();
  return NextResponse.json(getWorks);
}

export async function POST(restWork) {
  const { name} =
    await restWork.json();

  let work = await prisma.work.create({
    data: {
      name: name,
      is_deleted: false,
    },
  });

  await prisma.$disconnect();
  return NextResponse.json(work);
}