import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
    try {
        // Get and validate the token
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized: Missing token" }, { status: 401 });
        }

        // Decode the token to extract the email
        const decodedToken = jwt.decode(token) as { email: string };
        if (!decodedToken) {
            return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
        }

        // Find the therapist by email
        const therapist = await prisma.therapist.findUnique({ where: { email: decodedToken.email } });
        if (!therapist) {
            return NextResponse.json({ error: "Unauthorized: Therapist not found" }, { status: 401 });
        }

        // Parse the request body
        const { sessionId, response, notes } = await req.json();

        // Validate the required fields
        if (!sessionId || !response) {
            return NextResponse.json({ error: "Bad Request: Missing required fields" }, { status: 400 });
        }

        // Update the session log with the provided data
        const session = await prisma.sessionLog.update({
            where: { id: sessionId },
            data: {
                responses: response,
                notes,
                status: "completed",
            },
        });

        // Return the updated session log
        return NextResponse.json({ session }, { status: 200 });

    } catch (error) {
        console.error("Error updating session log:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
};
