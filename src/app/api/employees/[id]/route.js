import { NextResponse } from "next/server"
import react from "react";
import { PrismaClient } from "@prisma/client";
import { MdNoCell } from "react-icons/md";

const prisma = new PrismaClient()
export async function PUT(rest_employe,{params}){
    try {
      const data = await rest_employe.json() 
      const query = await prisma.employe.update({
          where:{ id: Number(params.id)},
          data:data
      })
      return NextResponse.json(query)
    } catch (error) {
      console.log('error', error)
      return NextResponse.json(error)
    }
  }


  export async function DELETE(rest_employe,{params}){
    try {
      const query = await prisma.employe.delete({
          where:{ id: Number(params.id)}
      })
      return NextResponse.json(query)
    } catch (error) {
      console.log('error', error)
      return NextResponse.json(error)
    } 
}


