import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@blinddate/database";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getAdminSession();
        if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        const users = await prisma.user.findMany({
            include: { profile: { select: { name: true, gender: true, city: true, isVerified: true } } },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({
            success: true,
            data: users.map((u) => ({
                id: u.id,
                email: u.email,
                phone: u.phone,
                role: u.role,
                status: u.status,
                createdAt: u.createdAt.toISOString(),
                profile: u.profile,
            })),
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
