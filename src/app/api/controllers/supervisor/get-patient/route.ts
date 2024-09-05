import { NextRequest,NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest) => {
    try {
        const id = req.nextUrl.searchParams.get("id");

        if (!id) return NextResponse.json({ error: "Missing id query parameter" }, { status: 400 });
        const patient = await prisma.patient.findUnique({ where: { id } });
        if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 });

        return NextResponse.json({ patient }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        
    } finally {
        await prisma.$disconnect();
    }
}