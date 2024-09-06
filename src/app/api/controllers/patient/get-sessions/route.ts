import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest) => {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        } 

        const decodededToken = jwt.decode(token) as {email: string};

        if (!decodededToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        const patient: any = await prisma.patient.findUnique({ where: {email: decodededToken.email} });
        if(!patient) { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
        const sessions =  await prisma.sessionLog.findMany({ where: {patientId: patient.id} });

        return NextResponse.json({sessions, message: "Sessions Sent"}, { status: 200 });
        
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}