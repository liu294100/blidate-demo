import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@blinddate/database";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getAdminSession();
        if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        const configs = await prisma.systemConfig.findMany({
            orderBy: { key: "asc" },
        });

        return NextResponse.json({ success: true, data: configs });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        const { configs } = await req.json();

        for (const [key, value] of Object.entries(configs as Record<string, string>)) {
            await prisma.systemConfig.upsert({
                where: { key },
                update: { value },
                create: { key, value },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
