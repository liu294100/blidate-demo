import { NextRequest } from "next/server";
import { prisma } from "@blinddate/database";
import { compare } from "bcryptjs";
import { createToken } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/utils";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return errorResponse("Email and password required", 400);
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return errorResponse("Invalid email or password", 401);
        }

        if (user.status === "BANNED") {
            return errorResponse("Account has been banned", 403);
        }

        const isValid = await compare(password, user.passwordHash);
        if (!isValid) {
            return errorResponse("Invalid email or password", 401);
        }

        const token = await createToken({
            id: user.id,
            email: user.email!,
            role: user.role,
            locale: user.locale,
        });

        const cookieStore = await cookies();
        cookieStore.set("auth-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        return successResponse({ id: user.id, role: user.role }, "Login successful");
    } catch (error: any) {
        console.error("Login error:", error);
        return errorResponse(error.message || "Login failed", 500);
    }
}
