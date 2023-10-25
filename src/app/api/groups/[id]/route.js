import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(rest_group, { params }) {
  try {
    const groupData = await rest_group.json();
    const query = await prisma.employe.update({
      where: { id: Number(params.id) },
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
    return NextResponse.json(query);
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(error);
  }
}
