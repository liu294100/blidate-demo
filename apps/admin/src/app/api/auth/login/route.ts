import { NextRequest } from "next/server";
import { prisma } from "@blinddate/database";
import { compare } from "bcryptjs";
import { createAdminToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.role !== "ADMIN") {
            return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
        }

        const isValid = await compare(password, user.passwordHash);
        if (!isValid) {
            return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
        }

        const token = await createAdminToken({
            id: user.id,
            email: user.email!,
            role: user.role,
        });

        const cookieStore = await cookies();
        cookieStore.set("admin-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24,
            path: "/",
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
