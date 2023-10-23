import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  let getActivitie = await prisma.activitie.findMany({
    where: {
      is_deleted: false,
    },include:{
        employe:true,
    }
  });
  await prisma.$disconnect();
  return NextResponse.json(getActivitie);
}

export async function POST(restActivitie) {
  const { name, description, color, employeId } =
    await restActivitie.json();

  let activitie = await prisma.activitie.create({
    data: {
      name: name,
      description: description,
      color: color,
      employe:{
        connect:{
            id:employeId
        }
      },
      is_deleted: false,
    },
  });

  await prisma.$disconnect();
  return NextResponse.json(activitie);
}