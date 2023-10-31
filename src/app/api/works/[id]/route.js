import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(restWork ,{ params }) {
  try {
    const {name} =
    await restWork.json();

  let work = await prisma.work.update({
    data: {
      name: name,
      is_deleted: false,
    },where:{ id:Number(params.id) }
  });
    return NextResponse.json(work);
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(error);
  }
}
