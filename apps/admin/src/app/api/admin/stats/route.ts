import { prisma } from "@blinddate/database";
import { getAdminSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getAdminSession();
        if (!session) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const [
            totalUsers,
            activeUsers,
            totalMatches,
            pendingModeration,
            pendingMatchmaker,
            totalOrders,
            revenueAgg,
        ] = await Promise.all([
            prisma.user.count({ where: { role: "USER" } }),
            prisma.user.count({ where: { role: "USER", status: "ACTIVE" } }),
            prisma.match.count(),
            prisma.profile.count({ where: { moderationStatus: "PENDING" } }),
            prisma.matchmakerRequest.count({ where: { status: "PENDING" } }),
            prisma.unlockRecord.count({ where: { status: "COMPLETED" } }),
            prisma.unlockRecord.aggregate({
                _sum: { amount: true },
                where: { status: "COMPLETED" },
            }),
        ]);

        return NextResponse.json({
            success: true,
            data: {
                totalUsers,
                activeUsers,
                totalMatches,
                pendingModeration,
                pendingMatchmaker,
                totalOrders,
                totalRevenue: revenueAgg._sum.amount || 0,
            },
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
