import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest) => {
    try {
        const token = req.cookies.get("token")?.value

        if(!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const decodededToken = jwt.decode(token) as { email: string };
        
        if(!decodededToken.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }  
        
        const therapist = await prisma.therapist.findUnique({
            where: {
                email: decodededToken.email
            }, select: { supervisor: true }
        });
        if(!therapist) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const supervisor = therapist.supervisor;

        return NextResponse.json({ supervisor, message: "Supervisor Details sent" }, { status: 200 });
        


    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }   
}