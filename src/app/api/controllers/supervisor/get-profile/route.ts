import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// http://localhost:3000/api/supervisor/get-profile?id=mcksdnvlksmdkvmslkmmvlksm

export const GET = async (req: NextRequest) => {
    try {
        const id = req.nextUrl.searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Missing id query parameter" }, { status: 400 });
        }

        const supervisor = await prisma.supervisor.findUnique({ where: { id } });

        if (!supervisor) {
            return NextResponse.json({ error: "Supervisor not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Data received successfully", supervisor }, { status: 200 });
    } catch (error) {
        console.error("Error in getting supervisor data", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
};
