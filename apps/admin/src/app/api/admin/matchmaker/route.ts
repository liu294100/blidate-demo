import { NextResponse } from "next/server";
import { prisma } from "@blinddate/database";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getAdminSession();
        if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        const requests = await prisma.matchmakerRequest.findMany({
            include: { user: { include: { profile: { select: { name: true } } } } },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({
            success: true,
            data: requests.map((r) => ({
                id: r.id,
                status: r.status,
                notes: r.notes,
                createdAt: r.createdAt.toISOString(),
                userName: r.user.profile?.name || r.user.email || "Unknown",
            })),
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
