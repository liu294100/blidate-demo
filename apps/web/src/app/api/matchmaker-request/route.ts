import { NextRequest } from "next/server";
import { prisma } from "@blinddate/database";
import { getSession } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/utils";

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) return errorResponse("Unauthorized", 401);

        const { matchId, notes } = await req.json();

        const request = await prisma.matchmakerRequest.create({
            data: {
                userId: session.id,
                matchId: matchId || null,
                notes: notes || null,
            },
        });

        return successResponse(request, "Matchmaker request submitted");
    } catch (error: any) {
        return errorResponse(error.message, 500);
    }
}
