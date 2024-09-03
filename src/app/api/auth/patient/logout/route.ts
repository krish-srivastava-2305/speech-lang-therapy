import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
    try {
        const response = NextResponse.json({ message: "Logout Success" }, { status: 200 });

        // Clear the JWT token from the cookies
        response.cookies.set("token", "", {
            httpOnly: true,
            maxAge: 0,
            path: "/",
        });

        return response;

    } catch (error) {
        console.error("Logout Error: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
};
