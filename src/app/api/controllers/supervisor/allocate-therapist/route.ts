import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
    try {
        const {patientId, newTherapistId} = await req.json();

        const updatedPatient = await prisma.patient.update({where: {id: patientId}, data: {therapistId: newTherapistId}});

        // send email to patient

        return NextResponse.json({message: "Therapist Allocated", patient: updatedPatient}, { status: 200 });
        
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}