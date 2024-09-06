import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { data } from "framer-motion/client";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  try {
    // Extract and decode the token from cookies
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

    // Verify that the therapist exists in the database
    const therapist = await prisma.therapist.findUnique({
      where: { email: decodedToken.email },
    });
    if (!therapist) {
      return NextResponse.json(
        { error: "Unauthorized: Therapist not found" },
        { status: 401 }
      );
    }

    // Extract details for creating the progress report
    const {
      patientId,
      date,
      recommendations,
      summary,
      challenges,
      patientBehaviour,
      improvementAreas,
      goalsMet,
      goalsUnmet,
      sessionLogs,
    } = await req.json();

    // Validate the required fields
    if (!patientId || !date || !summary) {
      return NextResponse.json(
        { error: "Bad Request: Missing required fields" },
        { status: 400 }
      );
    }

    // Check if the patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });
    if (!patient) {
      return NextResponse.json(
        { error: "Bad Request: Patient not found" },
        { status: 400 }
      );
    }

    // Create the new progress report
    const newProgressReport = await prisma.progressReport.create({
      data: {
        date: new Date(date),
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
          create: sessionLogs.map((log: any) => ({
            date: new Date(log.date),
            notes: log.notes,
            activities: log.activities,
            modifications: log.modifications,
            // Additional fields as per the schema
          })),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // update details of supervisor therapist and patient

    const updateTherapist = await prisma.therapist.update({where: {id: therapist.id}, data: {ProgressReport: {connect: {id: newProgressReport.id}}}});

    const updatePatient = await prisma.patient.update({where: {id: patient.id}, data: {progressReports: {connect: {id: newProgressReport.id}}}});

    const updateSupervisor = await prisma.supervisor.update({where: {id: therapist.supervisorId!}, data: {progressReports: {connect: {id: newProgressReport.id}}}});

    const notification = await prisma.notifications.create({ 
      data:{
        message: `Progress report for patient ${patient.name} created by therapist ${therapist.name}`,
        date: new Date(),
        type: "progressReport",
        patientId: patient.id,
        supervisorId: therapist.supervisorId!,
        createdAt: new Date(),
        updatedAt: new Date(),
    }});


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
