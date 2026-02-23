import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@blinddate/database";
import { getAdminSession } from "@/lib/auth";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getAdminSession();
        if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({
            where: { id: params.id },
            include: {
                profile: true,
                matchPreference: true,
                _count: {
                    select: {
                        likesGiven: true,
                        likesReceived: true,
                        matchesAsUser2: true, // simplified match count logic
                        messagesSent: true,
                    },
                },
            },
        });

        if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

        return NextResponse.json({ success: true, data: user });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getAdminSession();
        if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        const { status, profile, matchPreference } = await req.json();

        // Prepare update data
        const updateData: any = {};
        if (status) updateData.status = status;
        
        if (profile) {
            // Remove id, userId, createdAt, updatedAt from profile object if they exist
            const { id, userId, createdAt, updatedAt, ...profileData } = profile;
            updateData.profile = {
                upsert: {
                    create: {
                        ...profileData,
                        gender: profileData.gender || 'OTHER', // Provide default gender for create
                        birthDate: profileData.birthDate ? new Date(profileData.birthDate) : new Date(), // Provide default birthDate
                        photos: JSON.stringify(profileData.photos || []),
                    },
                    update: {
                        ...profileData,
                        photos: JSON.stringify(profileData.photos || []),
                    }
                }
            };
        }

        if (matchPreference) {
            // Remove id, userId, createdAt, updatedAt from matchPreference object if they exist
            const { id, userId, createdAt, updatedAt, ...prefData } = matchPreference;
            updateData.matchPreference = {
                upsert: {
                    create: prefData,
                    update: prefData,
                }
            };
        }

        const user = await prisma.user.update({
            where: { id: params.id },
            data: updateData,
            include: {
                profile: true,
                matchPreference: true,
            }
        });

        return NextResponse.json({ success: true, data: user });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
