import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function PUT(restHoliday, { params }) {
  try {
    const data = await restHoliday.json();
    const query = await prisma.holiday.update({
      where: { id: Number(params.id) },
      data: data,
    });
    return NextResponse.json(query);
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(error);
  }
}

export async function DELETE(restHoliday, { params }) {
  try {
    const query = await prisma.holiday.delete({
      where: { id: Number(params.id) },
    });
    return NextResponse.json(query);
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(error);
  }
}
