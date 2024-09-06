import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const PATCH = async (req: NextRequest) => {
  try {
    // Extract the id from the URL query parameters
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Invalid report ID" }, { status: 400 });
    }

    // Parse the request body to get supervisor feedback details
    const {
      supervisorFeedback,
      supervisorFeedbackOnPatient,
      supervisorRatings,
      supervisorId,
    } = await req.json();

    // Validate the input
    if (
      !supervisorFeedback ||
      !supervisorFeedbackOnPatient ||
      !supervisorRatings
    ) {
      return NextResponse.json(
        { error: "No feedback data provided" },
        { status: 400 }
      );
    }

    // Update the progress report with supervisor feedback
    const updatedProgressReport = await prisma.progressReport.update({
      where: { id },
      data: {
        supervisorFeedback,
        supervisorFeedbackOnPatient,
        supervisorRatings,
        supervisorId,
        updatedAt: new Date(),
      },
    });

    await prisma.notifications.create({
      data: {
        message: `Supervisor feedback updated for progress report ${id}`,
        date : new Date(),
        type: "feedback",
        therapistId: updatedProgressReport.therapistId,
        patientId: updatedProgressReport.patientId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }});

    return NextResponse.json(
      {
        progressReport: updatedProgressReport,
        message: "Feedback updated successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Error updating progress report with supervisor feedback:",
      error
    );
    return NextResponse.json(
      { error: "Error updating progress report" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};
