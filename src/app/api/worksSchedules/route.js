import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  let getWorkSche = await prisma.work_Schedule.findMany({
    include:{
        schedule:true,
        work:true
    }
  });
  await prisma.$disconnect();
  return NextResponse.json(getWorkSche);
}

export async function POST(restWorkSche) {
  const { workId,scheduleId } =
    await restWorkSche.json();

  let workSchedule = await prisma.work_Schedule.create({
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
    },
  });

  await prisma.$disconnect();
  return NextResponse.json(workSchedule);
}