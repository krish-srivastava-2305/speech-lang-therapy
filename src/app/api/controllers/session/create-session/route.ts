import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized: Missing token" }, { status: 401 });
        }

        const decodedToken = jwt.decode(token) as { email: string };
        if (!decodedToken) {
            return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
        }

        const therapist = await prisma.therapist.findUnique({ where: { email: decodedToken.email } });
        if (!therapist) {
            return NextResponse.json({ error: "Unauthorized: Therapist not found" }, { status: 401 });
        }

        const { patientId, date, activities, sessionType } = await req.json();

        // Basic validation for the required fields
        if (!patientId || !date || !activities || !sessionType) {
            return NextResponse.json({ error: "Bad Request: Missing required fields" }, { status: 400 });
        }

        // Check if patient exists
        const patient = await prisma.patient.findUnique({ where: { id: patientId } });
        if (!patient) {
            return NextResponse.json({ error: "Bad Request: Patient not found" }, { status: 400 });
        }

        const session = await prisma.sessionLog.create({
            data: {
                patientId,
                therapistId: therapist.id,
                date: new Date(date),
                responses: "",
                status: "pending",
                sessionType,
                supervisorId: therapist.supervisorId,
                activities,
                createdAt: new Date(),
            },
        });

        await prisma.patient.update({
            where: { id: patient.id },
            data: {
              sessionLogs: {
                connect: { id: session.id }
              }
            }
          });

        await prisma.therapist.update({ 
            where: { id: therapist.id }, 
            data: { sessionLogs: 
                { connect: 
                    { id: session.id } 
                }
            } 
        });
          
        return NextResponse.json({ message: "Session created successfully", session }, { status: 201 });

    } catch (error) {
        console.error("Error in creating session:", error);
        return NextResponse.json({ error: "Internal Server Error: Could not create session" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
};
