import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  let getProyects = await prisma.proyect.findMany({
    where: {
      is_deleted: false,
    },include:{
        activitie:true,
    }
  });
  await prisma.$disconnect();
  return NextResponse.json(getProyects);
}

export async function POST(restProyect) {
  const { name, code, type, activitieId } =
    await restProyect.json();

  let proyect = await prisma.proyect.create({
    data: {
      name: name,
      code: code,
      type: type,
      activitie:{
          connect:{
            id:activitieId
        }
      },
      is_deleted: false,
    },
  });

  await prisma.$disconnect();
  return NextResponse.json(proyect);
}