import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { s } from "framer-motion/client";

const prisma = new PrismaClient();

export const PATCH = async (req: NextRequest) => {
  try {
    const {
      supervisorFeedback,
      supervisorFeedbackOnPatient,
      supervisorRatings,
      progressReportId,
    } = await req.json();

    // Validate the input (trim spaces to ensure non-empty strings)
    if (
      !supervisorFeedback?.trim() ||
      !supervisorFeedbackOnPatient?.trim() ||
      !supervisorRatings?.trim()
    ) {
      return NextResponse.json(
        { error: "Feedback, Feedback on Patient, and Ratings are required" },
        { status: 400 }
      );
    }

    // Update the progress report with supervisor feedback
    const updatedProgressReport = await prisma.progressReport.update({
      where: { id: progressReportId },
      data: {
        supervisorFeedback,
        supervisorFeedbackOnPatient,
        supervisorRatings,
        updatedAt: new Date(),
      },
    });

    // Ensure therapistId and patientId exist before creating the notification
    if (updatedProgressReport.therapistId && updatedProgressReport.patientId) {
      await prisma.notifications.create({
        data: {
          message: `Supervisor feedback updated for progress report ${updatedProgressReport.supervisorId}`,
          date: new Date(),
          type: "feedback",
          therapistId: updatedProgressReport.therapistId,
          patientId: updatedProgressReport.patientId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json(
      {
        progressReport: updatedProgressReport,
        message: "Feedback updated successfully.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating progress report with supervisor feedback:", error.message || error);
    return NextResponse.json(
      { error: "Error updating progress report" },
      { status: 500 }
    );
  }
};
