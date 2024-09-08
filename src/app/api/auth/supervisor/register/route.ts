import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash, genSalt } from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();


export const POST = async (req: NextRequest): Promise<NextResponse> => { 
    const { email, password, name, phone, department } = await req.json();

    if(!email || !password || !name || !phone || !department) { return NextResponse.json({ error: "Missing required fields" }, { status: 400 }); }

    // Validate environment variables
    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not defined");
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    try {
        // Check if user already exists
        const existingUser = await prisma.supervisor.findUnique({ select: { id: true }, where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        // Validate phone number format
        const isPhoneValid = /^\d{10}$/.test(phone);
        if (!isPhoneValid) {
            return NextResponse.json({ error: "Phone number is invalid" }, { status: 400 });
        }

        // Hash password
        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);

        // Generate JWT token
        let token;
        try {
            token = jwt.sign({ email, userRole: "supervisor" }, process.env.JWT_SECRET, { expiresIn: "7d" });
        } catch (err) {
            console.error("Error generating JWT token", err);
            return NextResponse.json({ error: "Error creating account" }, { status: 500 });
        }

        // Create new user
        const newUser = await prisma.supervisor.create({
            data: {
                email,
                password: hashedPassword,
                name,
                token,
                tokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                phone,
                department
            }
        });

        if (!newUser) {
            return NextResponse.json({ error: "Error creating account" }, { status: 401 });
        }

        const response =  NextResponse.json({ message: "Supervisor ID created", newUser }, { status: 200 })

        response.cookies.set("token", token, { httpOnly: true, maxAge: 604800, path: "/" });
        return response;

    } catch (error) {
        console.error("Error occurred while creating user", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });  
    } finally {
        await prisma.$disconnect();
    }
}
