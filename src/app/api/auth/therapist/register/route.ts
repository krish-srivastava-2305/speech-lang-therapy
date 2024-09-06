import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash, genSalt } from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
    const { email, password, name, phone, department, specialization, city, state, supervisor } = await req.json();

    if(!email || !password || !name || !phone || !department || !specialization || !city || !state || !supervisor) { return NextResponse.json({ error: "Missing required fields" }, { status: 400 }); }

    try {
        const existingUser = await prisma.therapist.findUnique({ select: { id: true }, where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }  
        
        const isPhoneValid = /^\d{10}$/.test(phone);
        if (!isPhoneValid) {
            return NextResponse.json({ error: "Phone number is invalid" }, { status: 400 });
        }

        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);

        let token;
        try {
            token = jwt.sign({ email }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
        } catch (err) {
            console.error("Error generating JWT token", err);
            return NextResponse.json({ error: "Error creating account" }, { status: 500 });
        }

        const newUser = await prisma.therapist.create({
            data: {
                email,
                password: hashedPassword,
                name,
                token,
                tokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                phone,
                department,
                specialization,
                city,
                state,
                supervisorId: supervisor
            }
        });

        await prisma.supervisor.update({where: {id: supervisor}, data: {assignedTherapists: {connect: {id: newUser.id}}}});

        if (!newUser) {
            return NextResponse.json({ error: "Error creating account" }, { status: 401 });
        }

        const response = NextResponse.json({ message: "Account created successfully", token }, { status: 200 });

        response.cookies.set("token", token)
        return response;


    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error creating account" }, { status: 500 });
        
    }
}