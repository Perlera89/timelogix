import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  let employees = await prisma.employe.findMany({
    include: {
      group: true,
    },
  });
  await prisma.$disconnect();

  return NextResponse.json(employees);
}

export async function POST(restEmployee) {
  const employeeData = await restEmployee.json();

  let employee = await prisma.employe.create({
    data: {
      name: employeeData.name,
      group: {
        connect: {
          id: Number(employeeData.group_id),
        },
      },
      note: employeeData.note,
      is_deleted: false,
    },
  });

  await prisma.$disconnect();
  return NextResponse.json(employee);
}
