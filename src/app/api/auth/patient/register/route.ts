import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash, genSalt } from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import { caseAllocater } from "@/lib/case-allocater";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

interface CloudinaryResponse {
    public_id: string;
    secure_url: string;
    [key: string]: any;
}

export const POST = async (req: NextRequest) => {
    try {
        const formData: FormData = await req.formData();

        const requiredFields = ["email", "password", "name", "age", "phone", "city", "state", "medicalIssue", "image"];
        for (const field of requiredFields) {
            if (!formData.has(field)) {
                return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
            }
        }

        const data = {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            name: formData.get("name") as string,
            age: parseInt(formData.get("age") as string),
            phone: formData.get("phone") as string,
            city: formData.get("city") as string,
            state: formData.get("state") as string,
            medicalIssue: formData.get("medicalIssue") as string,
            image: formData.get("image") as File,
        };

        if (!/^\d{10}$/.test(data.phone)) {
            return NextResponse.json({ error: "Phone number is invalid" }, { status: 400 });
        }

        const existingUser = await prisma.patient.findUnique({ where: { email: data.email, phone: data.phone } });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const imageBuffer = Buffer.from(await data.image.arrayBuffer());
        const uploadResult = await new Promise<CloudinaryResponse>((resolve, reject) => {
            cloudinary.uploader.upload_stream({ folder: "profile-images" }, (error, result) => {
                if (error) reject(error);
                else resolve(result as CloudinaryResponse);
            }).end(imageBuffer);
        });

        const medicalRecord = formData.get("medicalRecords") as File;
        let medicalUploadResult: CloudinaryResponse | null = null;
        if (medicalRecord) {
            const medicalBuffer = Buffer.from(await medicalRecord.arrayBuffer());
            medicalUploadResult = await new Promise<CloudinaryResponse>((resolve, reject) => {
                cloudinary.uploader.upload_stream({ folder: "medical-records" }, (error, result) => {
                    if (error) reject(error);
                    else resolve(result as CloudinaryResponse);
                }).end(medicalBuffer);
            });
        }

        const therapists = await prisma.therapist.findMany({
            where: {
                city: data.city,
                specialization: data.medicalIssue,
            },
            select: {
                id: true,
                workload: true,
                supervisorId: true,
                city: true,
                specialization: true,
            },
        });

        const therapist = caseAllocater(therapists, data.city, data.medicalIssue);
        if (!therapist) {
            return NextResponse.json({ error: "No therapist available" }, { status: 400 });
        }

        const salt = await genSalt(10);
        const hashedPassword = await hash(data.password, salt);

        const token = jwt.sign({ email: data.email, userRole: "patient" }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

        const newUser = await prisma.patient.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                age: data.age,
                phone: data.phone,
                city: data.city,
                state: data.state,
                imageUrl: uploadResult.secure_url,
                medicalIssue: data.medicalIssue,
                medicalRecords: medicalUploadResult ? medicalUploadResult.secure_url : null,
                token,
                tokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                therapistId: therapist.id,
            },
        });

    
        await prisma.therapist.update({
            where: { id: therapist.id },
            data: {
                workload: { increment: 1 }, 
                assignedPatients: {
                    connect: { id: newUser.id },
                },
            },
        });

        // send mail to therapist


        await prisma.supervisor.update({
            where: { id: therapist.supervisorId as string },
            data: {
                assignedPatients: {
                    connect: { id: newUser.id },
                },
            },
        });

        // send mail to supervisor

        return NextResponse.json({ message: "Account created successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error occurred while creating user", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
};
