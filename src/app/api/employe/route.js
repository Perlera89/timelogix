import { NextResponse } from "next/server"
import react from "react";
import { PrismaClient } from "@prisma/client";
import { MdNoCell } from "react-icons/md";

const prisma = new PrismaClient()

export async function GET(){

 let items = await prisma.employe.findMany()
 await prisma.$disconnect()
 
 return NextResponse.json(items)
}

export async function POST(rest_employe){

    const {name,group,join_date,first_in,last_aut,note} = await rest_employe.json()

    let employees = await prisma.employe.create({
        data:{name:name,group:group,join_date:join_date,first_in:first_in,last_aut:last_aut,note:note}
    })

    await prisma.$disconnect()
    return NextResponse.json(employees)
}



