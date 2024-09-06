import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { CloudFog } from "lucide-react";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest) => {
    try {
        const token = req.cookies.get("token")?.value as string;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const decodedToken = jwt.decode(token) as { email: string }
        if (!decodedToken) return NextResponse.json({ error: "Invalid token" }, { status: 400 });

        const email = decodedToken.email;
        const therapist = await prisma.therapist.findUnique({where: {email: email}, select: {id: true,     assignedPatients: true}});

        if (!therapist) return NextResponse.json({ error: "Supervisor not found" }, { status: 404 });

        const allPatients = therapist.assignedPatients;
        console.log(therapist)
        console.log(allPatients)

        return NextResponse.json({ patients: allPatients, message: "All patient data sent" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}