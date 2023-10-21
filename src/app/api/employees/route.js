import { NextResponse } from "next/server";
import react from "react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  let employees = await prisma.employe.findMany();
  await prisma.$disconnect();

  return NextResponse.json(employees);
}

export async function POST(restEmployee) {
  const { name, group, joinDate, firstIn, lastOut, note } =
    await restEmployee.json();

  let employees = await prisma.employe.create({
    data: {
      name: name,
      group: group,
      join_date: joinDate,
      first_in: firstIn,
      last_aut: lastOut,
      note: note,
    },
  });

  await prisma.$disconnect();
  return NextResponse.json(employees);
}
