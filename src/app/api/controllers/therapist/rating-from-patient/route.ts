import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
    try {
        const token: string = req.cookies.get("token")?.value as string;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const decodedToken = jwt.decode(token) as { email: string }
        if (!decodedToken) return NextResponse.json({ error: "Invalid token" }, { status: 400 });

        const email = decodedToken.email;

        const patient = await prisma.patient.findUnique({
            where: {
                email: email
            },
            select: { id: true, therapistId: true }
        });
        if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 });

        const { rating } = await req.json() as { rating: number };

        const therapist = await prisma.therapist.findUnique({
            where: {
                id: patient.therapistId?.toString()
        }});
        if (!therapist) return NextResponse.json({ error: "Therapist not found" }, { status: 404 });

        const newRating = therapist.rating? (therapist.rating + rating) / 2 : rating;

        await prisma.therapist.update({
            where: {
                id: therapist.id
            },
            data: {
                rating: newRating
            }
        });

        await prisma.notifications.create({ data: {
            message: `Rating updated for therapist ${therapist.id}`,
            date: new Date(),
            type: "rating",
            therapistId: therapist.id,
            patientId: patient.id,
            createdAt: new Date(),
            updatedAt: new Date()
        }});
        
        return NextResponse.json({ rating: rating, message: "Rating saved" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}