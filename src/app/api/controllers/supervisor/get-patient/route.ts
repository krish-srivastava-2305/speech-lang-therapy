import { NextRequest,NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest) => {
    try {
        const id = req.nextUrl.searchParams.get("id");

        if (!id) return NextResponse.json({ error: "Missing id query parameter" }, { status: 400 });
        const therapist = await prisma.therapist.findUnique({ where: { id }, select:{assignedPatients: true} },);
        if (!therapist) return NextResponse.json({ error: "Therapist not found" }, { status: 404 });

        return NextResponse.json({ patients : therapist.assignedPatients }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        
    } finally {
        await prisma.$disconnect();
    }
}