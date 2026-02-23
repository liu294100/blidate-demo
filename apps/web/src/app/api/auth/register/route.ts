import { NextRequest } from "next/server";
import { prisma } from "@blinddate/database";
import { hash } from "bcryptjs";
import { createToken } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/utils";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password, name, gender, birthDate } = body;

        if (!email || !password || !name || !gender || !birthDate) {
            return errorResponse("Missing required fields", 400);
        }

        // Check if user exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return errorResponse("Email already registered", 409);
        }

        const passwordHash = await hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                profile: {
                    create: {
                        name,
                        gender,
                        birthDate: new Date(birthDate),
                    },
                },
                matchPreference: {
                    create: {
                        genderPref: gender === "MALE" ? "FEMALE" : "MALE",
                    },
                },
            },
        });

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
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return successResponse({ id: user.id }, "Registration successful");
    } catch (error: any) {
        console.error("Register error:", error);
        return errorResponse(error.message || "Registration failed", 500);
    }
}
