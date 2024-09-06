import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest) => {
    try {
        const token : string = req.cookies.get("token")?.value as string;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const decodedToken = jwt.decode(token) as { email: string }
        if (!decodedToken) return NextResponse.json({ error: "Invalid token" }, { status: 400 });

        const email = decodedToken.email;

        const supervisor = await prisma.supervisor.findUnique({
            where: {
                email: email
            },
            select: {  id: true, assignedTherapists: true }
        });
        if (!supervisor) return NextResponse.json({ error: "Supervisor not found" }, { status: 404 });

        const allTherapists = supervisor.assignedTherapists;
         
        return NextResponse.json({ therapists: allTherapists, message: "All therapist data sent" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}