import { prisma } from "@blinddate/database";
import { getSession } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET() {
    try {
        const session = await getSession();
        if (!session) return errorResponse("Unauthorized", 401);

        // Get user's preferences
        const pref = await prisma.matchPreference.findUnique({
            where: { userId: session.id },
        });

        // Get IDs the user already liked
        const likedIds = await prisma.like.findMany({
            where: { fromUserId: session.id },
            select: { toUserId: true },
        });
        const likedSet = new Set(likedIds.map((l) => l.toUserId));

        // Build search query based on preferences
        const where: any = {
            userId: { not: session.id },
            user: { status: "ACTIVE" },
            moderationStatus: "APPROVED",
        };

        if (pref?.genderPref) {
            where.gender = pref.genderPref;
        }

        // Fetch profiles
        const profiles = await prisma.profile.findMany({
            where,
            take: 20,
            orderBy: { createdAt: "desc" },
            include: { user: { select: { id: true } } },
        });

        // Filter out already liked
        const filtered = profiles
            .filter((p) => !likedSet.has(p.userId))
            .map((p) => ({
                id: p.userId,
                name: p.name,
                gender: p.gender,
                birthDate: p.birthDate.toISOString(),
                height: p.height,
                education: p.education,
                occupation: p.occupation,
                city: p.city,
                bio: p.bio,
                photos: p.photos as string[],
                avatarUrl: p.avatarUrl,
                isVerified: p.isVerified,
            }));

        return successResponse(filtered);
    } catch (error: any) {
        return errorResponse(error.message, 500);
    }
}
