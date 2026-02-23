import { NextResponse } from "next/server";
import { prisma } from "@blinddate/database";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getAdminSession();
        if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        const profiles = await prisma.profile.findMany({
            where: { moderationStatus: "PENDING" },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({
            success: true,
            data: profiles.map((p) => ({
                id: p.id,
                name: p.name,
                gender: p.gender,
                bio: p.bio,
                moderationStatus: p.moderationStatus,
                userId: p.userId,
            })),
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
