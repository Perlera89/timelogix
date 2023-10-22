import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default function handler(req, res) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const intervalId = setInterval(() => {
    const employeesData = getEmployeesData();
    res.write(`data: ${JSON.stringify(employeesData)}\n\n`);
  }, 5000);

  req.on("close", () => {
    clearInterval(intervalId);
    res.end();
  });
}

export async function GET() {
  let employees = await prisma.employe.findMany({
    where: {
      is_deleted: false,
    },
    include: {
      group: true,
    },
  });
  await prisma.$disconnect();

  return NextResponse.json(employees);
}

export async function POST(restEmployee) {
  const { name, groupId, joinDate, firstIn, lastOut, note } =
    await restEmployee.json();

  let employee = await prisma.employe.create({
    data: {
      name: name,
      group: {
        connect: {
          id: groupId,
        },
      },
      join_date: joinDate,
      first_in: firstIn,
      last_aut: lastOut,
      note: note,
      is_deleted: false,
    },
  });

  await prisma.$disconnect();
  return NextResponse.json(employee);
}
