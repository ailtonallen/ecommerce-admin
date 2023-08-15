import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

//funcao inserir
export async function POST(req:Request,
    ) {
    try{

        const {userId} = auth();
const body = await req.json();
const {name} = body;

        if(!userId){
            return new NextResponse("Sem autorização", {status: 401});
        }

        if(!name){
            return new NextResponse("É necessario um nome!!!", {status: 400});
        }

        const store = await prismadb.store.create({
            data: {
                name,
                userId
            }
        });
        return NextResponse.json(store);
    }catch (error){
        console.log('[STORES_POST]', error);
        return new NextResponse("Error Interno", {status: 500});
    }
}