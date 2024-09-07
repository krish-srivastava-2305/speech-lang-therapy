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


    const patient = await prisma.patient.findUnique({ where: { id }, select: { progressReports: true } });

    if(!patient) {  return NextResponse.json({ error: "Patient not found" }, { status: 404 }); }

    return NextResponse.json({ progressReport: patient?.progressReports }, { status: 200 });
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
