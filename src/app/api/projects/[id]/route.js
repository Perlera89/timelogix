import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(restProyect ,{ params }) {
  try {
    const {name, code, type, activitieId } =
    await restProyect.json();

  let proyect = await prisma.proyect.update({
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
    },where:{ id:Number(params.id)}
  });
    return NextResponse.json(proyect);
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(error);
  }
}
