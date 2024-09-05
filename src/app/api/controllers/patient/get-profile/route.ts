import { NextRequest,NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async ({params}: {params: {id: string}}) => {
    try {
        const patient = await prisma.patient.findUnique({
            where: {
                id: params.id
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                therapistId: true
            }
        })
        if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 });

        return NextResponse.json({ patient: patient, message: "Patient data sent" }, { status: 200 });
        
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        
    }  finally {
        await prisma.$disconnect();
    }
}