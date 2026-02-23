import { NextRequest } from "next/server";
import { prisma } from "@blinddate/database";
import { getSession } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(
    req: NextRequest,
    { params }: { params: { matchId: string } }
) {
    try {
        const session = await getSession();
        if (!session) return errorResponse("Unauthorized", 401);

        const { matchId } = params;

        const match = await prisma.match.findUnique({
            where: { id: matchId },
            include: {
                user1: { include: { profile: { select: { name: true } } } },
                user2: { include: { profile: { select: { name: true } } } },
            },
        });

        if (!match) return errorResponse("Match not found", 404);
        if (match.user1Id !== session.id && match.user2Id !== session.id) {
            return errorResponse("Not authorized", 403);
        }

        const isUser1 = match.user1Id === session.id;
        const otherUserName = isUser1
            ? match.user2.profile?.name || "Unknown"
            : match.user1.profile?.name || "Unknown";

        const messages = await prisma.message.findMany({
            where: { matchId },
            orderBy: { createdAt: "asc" },
            take: 100,
        });

        return successResponse({
            match: {
                id: match.id,
                isUnlocked: match.isUnlocked,
                otherUserName,
            },
            messages: messages.map((m) => ({
                id: m.id,
                senderId: m.senderId,
                content: m.content,
                type: m.type,
                createdAt: m.createdAt.toISOString(),
            })),
            currentUserId: session.id,
        });
    } catch (error: any) {
        return errorResponse(error.message, 500);
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: { matchId: string } }
) {
    try {
        const session = await getSession();
        if (!session) return errorResponse("Unauthorized", 401);

        const { matchId } = params;
        const { content } = await req.json();

        if (!content?.trim()) return errorResponse("Message content required", 400);

        // Verify match exists and is unlocked
        const match = await prisma.match.findUnique({ where: { id: matchId } });
        if (!match) return errorResponse("Match not found", 404);
        if (match.user1Id !== session.id && match.user2Id !== session.id) {
            return errorResponse("Not authorized", 403);
        }
        if (!match.isUnlocked) {
            return errorResponse("Match is not unlocked", 403);
        }

        const message = await prisma.message.create({
            data: {
                matchId,
                senderId: session.id,
                content: content.trim(),
                type: "TEXT",
            },
        });

        return successResponse({
            id: message.id,
            senderId: message.senderId,
            content: message.content,
            type: message.type,
            createdAt: message.createdAt.toISOString(),
        });
    } catch (error: any) {
        return errorResponse(error.message, 500);
    }
}
