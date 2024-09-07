import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest) => {
    try {
        const id = req.nextUrl.searchParams.get("id");
        console.log(id);

        if (!id) {
            return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
        }

        // Fetch the patient with session logs ordered by createdAt
        const patient = await prisma.patient.findUnique({
            where: { id },
            select: {
                sessionLogs: {
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        if (!patient) {
            return NextResponse.json({ error: "Patient Not Found" }, { status: 404 });
        }

        const sessionsCount = patient.sessionLogs.length;

        return NextResponse.json(
            { sessions: patient.sessionLogs, message: "Sessions Sent", sessionsCount },
            { status: 200 }
        );
    } catch (error) {
        console.error(error); // Log the error for better debugging
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
};
