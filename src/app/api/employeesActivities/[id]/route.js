import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(restEmpAct ,{ params }) {
  try {
    const {employeId, activitieId} =
    await restEmpAct.json();

  let employe_Activitie = await prisma.employe_Activitie.update({
    data: {
      activitie:{
        connect:{
            id:activitieId
        },
      },
      employe:{
        connect:{
            id:employeId
        },
      },
    },where:{ id:Number(params.id)}
  });
    return NextResponse.json(employe_Activitie);
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(error);
  }
}
