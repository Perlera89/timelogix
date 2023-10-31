import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(restSchedule ,{ params }) {
  try {
    const {name, startTime, endTime, note } =
    await restSchedule.json();

  let schedule = await prisma.schedule.update({
    data: {
      name: name,
      start_time: startTime,
      end_time: endTime,
      note: note,
      is_deleted: false,
    },where:{ id:Number(params.id)}
  });
    return NextResponse.json(schedule);
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(error);
  }
}
