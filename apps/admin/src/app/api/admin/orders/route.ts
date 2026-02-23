import { NextResponse } from "next/server";
import { prisma } from "@blinddate/database";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getAdminSession();
        if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        const records = await prisma.unlockRecord.findMany({
            include: { user: { include: { profile: { select: { name: true } } } } },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({
            success: true,
            data: records.map((r) => ({
                id: r.id,
                amount: r.amount,
                paymentType: r.paymentType,
                status: r.status,
                createdAt: r.createdAt.toISOString(),
                userName: r.user.profile?.name || r.user.email || "Unknown",
            })),
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
