import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type UpdatedDataType = {
    name?: string;
    email?: string;
    phone?: string;
    department?: string;
};  

export const PUT = async (req: NextRequest) => {
    try {
        const email = req.cookies.get("email")?.value;
        if (!email) {
            return NextResponse.json({ error: "Missing email cookie! Please login again" }, { status: 400 });
        }

        const { name, phone, department } = await req.json();

        if (!name && !phone && !department) {
            return NextResponse.json({ error: "Update at least one field" }, { status: 400 });
        }

        const updateData: Partial<UpdatedDataType> = {};
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        if (department) updateData.department = department;

        const supervisor = await prisma.supervisor.update({
            where: { email },
            data: updateData,
        });

        return NextResponse.json({ message: "Profile updated successfully", supervisor }, { status: 200 });

    } catch (error) {
        console.error("Error updating supervisor profile", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
};
