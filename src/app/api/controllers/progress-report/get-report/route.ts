import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest) => {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Invalid patient ID" },
        { status: 400 }
      );
    }

    // Fetch the progress report for the specified patient from the database
    const progressReport = await prisma.progressReport.findUnique({
      where: {
        id, // Use the extracted patientId
      },
    });

    if (!progressReport) {
      return NextResponse.json(
        { message: "No progress report found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ progressReport }, { status: 200 });
  } catch (error) {
    console.error("Error fetching progress report:", error);
    return NextResponse.json(
      { error: "Error fetching progress report" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};
