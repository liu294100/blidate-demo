import { NextRequest } from "next/server";
import { prisma } from "@blinddate/database";
import { getSession } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/utils";

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) return errorResponse("Unauthorized", 401);

        const { matchId, paymentType } = await req.json();

        if (!matchId) return errorResponse("matchId is required", 400);

        // Verify the user is part of this match
        const match = await prisma.match.findUnique({ where: { id: matchId } });
        if (!match) return errorResponse("Match not found", 404);
        if (match.user1Id !== session.id && match.user2Id !== session.id) {
            return errorResponse("Not authorized", 403);
        }

        if (match.isUnlocked) {
            return successResponse({ alreadyUnlocked: true });
        }

        // Create unlock record (mock payment)
        await prisma.unlockRecord.create({
            data: {
                matchId,
                userId: session.id,
                paymentType: paymentType || "PAYMENT",
                amount: 29.9,
                status: "COMPLETED", // mock: auto-complete
            },
        });

        // Update match to unlocked
        await prisma.match.update({
            where: { id: matchId },
            data: {
                isUnlocked: true,
                unlockedBy: session.id,
                unlockedAt: new Date(),
            },
        });

        return successResponse({ unlocked: true }, "Unlock successful");
    } catch (error: any) {
        return errorResponse(error.message, 500);
    }
}
