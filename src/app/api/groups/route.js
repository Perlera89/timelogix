import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  let groups = await prisma.group.findMany({
    where: {
      is_deleted: false,
    },
  });

  await prisma.$disconnect();

  return NextResponse.json(groups);
}

export async function POST(restGroup) {
  const { name, note } =
    await restGroup.json();

  let group = await prisma.group.create({
    data: {
      name: name,
      note: note,
      is_deleted: false,
    },
  });

  await prisma.$disconnect();
  return NextResponse.json(group);
}
