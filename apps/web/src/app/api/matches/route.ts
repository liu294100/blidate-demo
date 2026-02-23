import { prisma } from "@blinddate/database";
import { getSession } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET() {
    try {
        const session = await getSession();
        if (!session) return errorResponse("Unauthorized", 401);

        const matches = await prisma.match.findMany({
            where: {
                OR: [
                    { user1Id: session.id },
                    { user2Id: session.id },
                ],
            },
            include: {
                user1: { include: { profile: true } },
                user2: { include: { profile: true } },
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                },
            },
            orderBy: { createdAt: "desc" },
        });

        const result = matches.map((match) => {
            const isUser1 = match.user1Id === session.id;
            const otherUser = isUser1 ? match.user2 : match.user1;
            const otherProfile = otherUser.profile;

            return {
                id: match.id,
                isUnlocked: match.isUnlocked,
                createdAt: match.createdAt.toISOString(),
                otherUser: {
                    id: otherUser.id,
                    name: otherProfile?.name || "Unknown",
                    gender: otherProfile?.gender || "OTHER",
                    birthDate: otherProfile?.birthDate?.toISOString() || "",
                    avatarUrl: otherProfile?.avatarUrl || null,
                    city: otherProfile?.city || null,
                    photos: (otherProfile?.photos as string[]) || [],
                },
                lastMessage: match.messages[0]
                    ? {
                        content: match.messages[0].content,
                        createdAt: match.messages[0].createdAt.toISOString(),
                    }
                    : undefined,
            };
        });

        return successResponse(result);
    } catch (error: any) {
        return errorResponse(error.message, 500);
    }
}
