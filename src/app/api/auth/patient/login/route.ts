import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
    const { email, password } = await req.json();

    if (!email || !password) {
        return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Validate environment variables
    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not defined");
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    try {
        // Check if user exists
        const existingUser = await prisma.patient.findUnique({
            select: { id: true, password: true },
            where: { email }
        });

        if (!existingUser || !existingUser.password) {
            return NextResponse.json({ error: "User not found or invalid password" }, { status: 400 });
        }

        // Compare password
        const isPasswordValid = await compare(password, existingUser.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid password" }, { status: 400 });
        }

        // Generate JWT token
        let token;
        try {
            token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });
        } catch (err) {
            console.error("Error generating JWT token", err);
            return NextResponse.json({ error: "Error logging in" }, { status: 500 });
        }

        // Update user token
        const updatedUser = await prisma.patient.update({
            where: { email },
            data: {
                token,
                tokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            }
        });

        if (!updatedUser) {
            return NextResponse.json({ error: "Error logging in" }, { status: 401 });
        }

        const response = NextResponse.json({ message: "Logged in" }, { status: 200 });
        response.cookies.set("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
            path: "/",
        });

        return response;
    } catch (err) {
        console.error("Error logging in", err);
        return NextResponse.json({ error: "Error logging in" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
};
