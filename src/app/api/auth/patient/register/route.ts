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

        // Required fields
        const requiredFields = ["email", "password", "name", "age", "phone", "city", "state", "medicalHistory", "image"];

        // Check for missing fields
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

        // Check if the user already exists
        const existingUser = await prisma.patient.findUnique({
            select: { email: true },
            where: { email: data.email },
        });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        // Validate phone number
        const isPhoneValid = /^\d{10}$/.test(data.phone);
        if (!isPhoneValid) {
            return NextResponse.json({ error: "Phone number is invalid" }, { status: 400 });
        }

        // Image upload to Cloudinary
        const bytes = await data.image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        let uploadResult: CloudinaryResponse;

        try {
            uploadResult = await new Promise<CloudinaryResponse>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "profile-images" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result as CloudinaryResponse);
                    }
                );
                uploadStream.end(buffer);
            });
        } catch (error) {
            console.error("Error uploading image to Cloudinary", error);
            return NextResponse.json({ error: "Error uploading image" }, { status: 500 });
        }

        const medicalRecord = formData.get("medicalRecords") as File
        let medicalUploadResult: CloudinaryResponse | null = null;
        if(medicalRecord) { 
            const medicalBytes = await medicalRecord.arrayBuffer();
            const medicalBuffer = Buffer.from(medicalBytes);
            try {
                medicalUploadResult = await new Promise<CloudinaryResponse>((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder: "medical-records" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result as CloudinaryResponse);
                        }
                    );
                    uploadStream.end(medicalBuffer);
                });
            } catch (error) {
                console.error("Error uploading image to Cloudinary", error);
                return NextResponse.json({ error: "Error uploading image" }, { status: 500 });
            }
        }


        //function to allocate therapist

        const therapists = await prisma.therapist.findMany({ select: { id: true, city:true, specialization:true, workload: true }});

        
        const therapist = caseAllocater(therapists, data.city, data.medicalIssue);
        // Hash the password
        const salt = await genSalt(10);
        const hashedPassword = await hash(data.password, salt);

        // Generate JWT token
        let token;
        try {
            token = jwt.sign({ email: data.email }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
        } catch (error) {
            console.error("Error generating JWT token", error);
            return NextResponse.json({ error: "Error creating account" }, { status: 500 });
        }

        // Create new user
        const newUser = await prisma.patient.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                age: data.age,
                phone: data.phone,
                therapistId: therapist ? therapist.id : null,
                city: data.city,
                state: data.state,
                imageUrl: uploadResult.secure_url,
                medicalIssue: data.medicalIssue,
                medicalRecords: medicalUploadResult ? medicalUploadResult.secure_url : null,    
                token,
                tokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            },
        });

        if (!newUser) {
            return NextResponse.json({ error: "Error creating account" }, { status: 500 });
        }

        return NextResponse.json({ message: "Account created successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error occurred while creating user", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
};
