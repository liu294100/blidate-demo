import { NextRequest } from "next/server";
import { prisma } from "@blinddate/database";
import { getSession } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/utils";

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) return errorResponse("Unauthorized", 401);

        const { toUserId } = await req.json();
        if (!toUserId) return errorResponse("toUserId is required", 400);

        // Create the like
        await prisma.like.create({
            data: {
                fromUserId: session.id,
                toUserId,
            },
        });

        // Check if the other user also liked us (mutual match)
        const mutualLike = await prisma.like.findUnique({
            where: {
                fromUserId_toUserId: {
                    fromUserId: toUserId,
                    toUserId: session.id,
                },
            },
        });

        let matched = false;

        if (mutualLike) {
            // Create a match - sort IDs to ensure consistent ordering
            const [user1Id, user2Id] = [session.id, toUserId].sort();

            const existingMatch = await prisma.match.findUnique({
                where: { user1Id_user2Id: { user1Id, user2Id } },
            });

            if (!existingMatch) {
                await prisma.match.create({
                    data: { user1Id, user2Id },
                });
                matched = true;
            }
        }

        return successResponse({ liked: true, matched });
    } catch (error: any) {
        // Duplicate like - ignore
        if (error.code === "P2002") {
            return successResponse({ liked: true, matched: false });
        }
        return errorResponse(error.message, 500);
    }
}
