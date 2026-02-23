import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@blinddate/database";
import { getAdminSession } from "@/lib/auth";

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getAdminSession();
        if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        const { moderationStatus } = await req.json();

        await prisma.profile.update({
            where: { id: params.id },
            data: { moderationStatus },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
