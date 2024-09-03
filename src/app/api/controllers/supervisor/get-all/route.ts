import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest) => {
    try {
        const supervisors = await prisma.supervisor.findMany({select: {id: true, name: true}});
        return NextResponse.json({ supervisors }, { status  : 200 });
        
    } catch (error) {
        console.error("Error getting all supervisors", error);
        return NextResponse.json({ error: "Error getting all supervisors" }, { status: 500 });
        
    }
}