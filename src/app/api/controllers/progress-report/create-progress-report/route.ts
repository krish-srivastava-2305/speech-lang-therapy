import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { data } from "framer-motion/client";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Missing token" },
        { status: 401 }
      );
    }

    const decodedToken = jwt.decode(token) as { email: string };
    if (!decodedToken) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    const therapist = await prisma.therapist.findUnique({
      where: { email: decodedToken.email },
    });
    if (!therapist) {
      return NextResponse.json(
        { error: "Unauthorized: Therapist not found" },
        { status: 401 }
      );
    }

    const {
      patientId,
      recommendations,
      summary,
      challenges,
      patientBehaviour,
      improvementAreas,
      goalsMet,
      goalsUnmet,
      sessionLogIds,
    } = await req.json();

    const sessionLogIdsArray = sessionLogIds.split(",").map((id: string) => id.trim());

    if (!patientId || !summary || !Array.isArray(sessionLogIdsArray) || sessionLogIds.length === 0) {
      return NextResponse.json(
        { error: "Bad Request: Missing required fields or session log IDs" },
        { status: 400 }
      );
    }

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });
    if (!patient) {
      return NextResponse.json(
        { error: "Bad Request: Patient not found" },
        { status: 400 }
      );
    }

    const newProgressReport = await prisma.progressReport.create({
      data: {
        date: new Date(),
        recommendations,
        summary,
        challenges,
        patientBehaviour,
        improvementAreas,
        goalsMet,
        goalsUnmet,
        therapistId: therapist.id,
        patientId: patient.id,
        sessionLogs: {
          connect: sessionLogIdsArray.map((id: string) => ({ id })),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        message: "Progress report created successfully",
        progressReport: newProgressReport,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in creating progress report:", error);
    return NextResponse.json(
      { error: "Internal Server Error: Could not create progress report" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};

