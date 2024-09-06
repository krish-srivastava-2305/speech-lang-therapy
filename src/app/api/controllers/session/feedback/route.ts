import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
    try {
        // Retrieve the JWT token from cookies
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized: Missing token" }, { status: 401 });
        }

        // Decode the token to extract the email
        const decodedToken = jwt.decode(token) as { email: string };
        if (!decodedToken) {
            return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
        }

        // Find the patient using the email from the decoded token
        const patient = await prisma.patient.findUnique({ where: { email: decodedToken.email } });
        if (!patient) {
            return NextResponse.json({ error: "Unauthorized: Patient not found" }, { status: 401 });
        }

        // Parse the request body to get sessionId and feedback
        const { sessionId, feedback } = await req.json();

        // Validate that both sessionId and feedback are provided
        if (!sessionId || !feedback) {
            return NextResponse.json({ error: "Bad Request: Missing required fields" }, { status: 400 });
        }

        // Update the session log with the patient's feedback
        const session = await prisma.sessionLog.update({
            where: { id: sessionId },
            data: { patientFeedback: feedback },
        });

        await prisma.notifications.create({ data: {
            message: `Patient feedback updated for session ${sessionId}`,
            date: new Date(),
            type: "feedback",
            therapistId: session.therapistId,
            patientId: session.patientId,
            createdAt: new Date(),
            updatedAt: new Date(),
        }});

        // Respond with the updated session log
        return NextResponse.json({ session }, { status: 200 });
        
    } catch (error) {
        console.error("Error updating session log:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        // Ensure Prisma disconnects from the database
        await prisma.$disconnect();
    }
};
