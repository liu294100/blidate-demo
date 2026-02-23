import { NextRequest } from "next/server";
import { prisma } from "@blinddate/database";
import { getSession } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET() {
    try {
        const session = await getSession();
        if (!session) return errorResponse("Unauthorized", 401);

        const profile = await prisma.profile.findUnique({
            where: { userId: session.id },
        });

        const preference = await prisma.matchPreference.findUnique({
            where: { userId: session.id },
        });

        return successResponse({ ...profile, preference });
    } catch (error: any) {
        return errorResponse(error.message, 500);
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) return errorResponse("Unauthorized", 401);

        const body = await req.json();
        const { height, weight, education, occupation, income, bio, city, province, country, contact, preferenceDesc, minAge, maxAge, genderPref, minHeight, educationPref } = body;

        // Update Profile
        const profile = await prisma.profile.update({
            where: { userId: session.id },
            data: {
                ...(height !== undefined && { height: Number(height) }),
                ...(weight !== undefined && { weight: Number(weight) }),
                ...(education !== undefined && { education }),
                ...(occupation !== undefined && { occupation }),
                ...(income !== undefined && { income }),
                ...(bio !== undefined && { bio }),
                ...(city !== undefined && { city }),
                ...(province !== undefined && { province }),
                ...(country !== undefined && { country }),
                ...(contact !== undefined && { contact }),
            },
        });

        // Update MatchPreference
        const prefData: any = {};
        if (preferenceDesc !== undefined) prefData.description = preferenceDesc;
        if (minAge !== undefined) prefData.minAge = Number(minAge);
        if (maxAge !== undefined) prefData.maxAge = Number(maxAge);
        if (genderPref !== undefined) prefData.genderPref = genderPref;
        if (minHeight !== undefined) prefData.minHeight = Number(minHeight);
        if (educationPref !== undefined) prefData.educationPref = educationPref;

        if (Object.keys(prefData).length > 0) {
            await prisma.matchPreference.upsert({
                where: { userId: session.id },
                create: {
                    userId: session.id,
                    ...prefData
                },
                update: prefData,
            });
        }

        // Return combined data
        const pref = await prisma.matchPreference.findUnique({
             where: { userId: session.id },
        });

        return successResponse({ ...profile, preference: pref }, "Profile updated");
    } catch (error: any) {
        return errorResponse(error.message, 500);
    }
}
