import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(restWorkSche ,{ params }) {
  try {
    const {workId,scheduleId } =
    await restWorkSche.json();

  let workSchedule = await prisma.work_Schedule.update({
    data: {
      work:{
        connect:{
            id:workId
        }
      },
      schedule:{
        connect:{
            id:scheduleId
        }
      }
    },where:{ id:Number(params.id) }
  });
    return NextResponse.json(workSchedule);
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(error);
  }
}
