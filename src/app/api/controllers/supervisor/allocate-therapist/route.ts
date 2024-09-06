import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
    try {
        const {patientId, oldTherapistId, newTherapistId} = await req.json();

        const updatedPatient = await prisma.patient.update({where: {id: patientId}, data: {therapistId: newTherapistId}});

        const therapist = await prisma.therapist.update({where: {id: oldTherapistId},
            data: {assignedPatients: {disconnect: {id: patientId}}}
        });

        await prisma.therapist.update({where: {id: newTherapistId},
            data: {assignedPatients: {connect: {id: patientId}}}
        });

        await prisma.notifications.create({data: {
            message: `Patient ${updatedPatient.name} has been allocated to therapist ${newTherapistId}`,
            date: new Date(),
            type: "allocation",
            therapistId: newTherapistId,
            patientId: patientId,
            createdAt: new Date(),
            updatedAt: new Date(),
        }});

        return NextResponse.json({message: "Therapist Allocated", patient: updatedPatient}, { status: 200 });
        
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}