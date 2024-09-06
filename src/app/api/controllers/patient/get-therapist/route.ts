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

        const patient = await prisma.patient.findUnique({
            where: {
                email: email
            },
            select: {  id: true, therapistId: true }
        });
        if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 });

        const therapist = await prisma.therapist.findUnique({
            where: {
                id: patient.therapistId?.toString()
            }
        });
        if (!therapist) return NextResponse.json({ error: "Therapist not found" }, { status: 404 });

        return NextResponse.json({ therapist, message: "Therapist data sent" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}