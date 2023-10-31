import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(restActivitie, { params }) {
  try {
    const {name, description, color, employeId } =
    await restActivitie.json();

  let activitie = await prisma.activitie.update({
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
    },where:{ id:Number(params.id)}
  });
    return NextResponse.json(activitie);
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(error);
  }
}
