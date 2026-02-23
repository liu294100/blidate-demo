"use client";

import { calculateAge } from "@/lib/utils";
import type { Education } from "@blinddate/shared";

const EDUCATION_SHORT: Record<string, string> = {
    HIGH_SCHOOL: "高中",
    ASSOCIATE: "大专",
    BACHELOR: "本科",
    MASTER: "硕士",
    DOCTORATE: "博士",
    OTHER: "其他",
};

interface ProfileCardProps {
    profile: {
        id: string;
        name: string;
        gender: string;
        birthDate: string;
        height?: number | null;
        education?: Education | null;
        occupation?: string | null;
        city?: string | null;
        bio?: string | null;
        photos: string[];
        avatarUrl?: string | null;
        isVerified: boolean;
    };
    onLike?: () => void;
    onDislike?: () => void;
    showActions?: boolean;
}

export default function ProfileCard({
    profile,
    onLike,
    onDislike,
    showActions = true,
}: ProfileCardProps) {
    const age = calculateAge(new Date(profile.birthDate));
    const avatar = profile.avatarUrl || (profile.photos.length > 0 ? profile.photos[0] : null);

    return (
        <div className="card overflow-hidden animate-scale-in">
            {/* Photo */}
            <div className="relative -mx-6 -mt-6 mb-4 aspect-[3/4] bg-gradient-to-br from-primary-100 to-accent-100 overflow-hidden">
                {avatar ? (
                    <img src={avatar} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl">
                            {profile.gender === "FEMALE" ? "👩" : "👨"}
                        </span>
                    </div>
                )}

                {profile.isVerified && (
                    <div className="absolute top-3 right-3 badge-success">
                        ✓ 已认证
                    </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Name + age on photo */}
                <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-bold">{profile.name}, {age}</h3>
                    <div className="flex items-center gap-2 text-sm opacity-90 mt-1">
                        {profile.city && <span>📍 {profile.city}</span>}
                        {profile.education && <span>🎓 {EDUCATION_SHORT[profile.education] || profile.education}</span>}
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                    {profile.height && (
                        <span className="badge bg-gray-100 text-gray-600">📏 {profile.height}cm</span>
                    )}
                    {profile.occupation && (
                        <span className="badge bg-gray-100 text-gray-600">💼 {profile.occupation}</span>
                    )}
                </div>

                {profile.bio && (
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                        {profile.bio}
                    </p>
                )}
            </div>

            {/* Actions */}
            {showActions && (
                <div className="flex items-center justify-center gap-4 mt-6">
                    <button
                        onClick={onDislike}
                        className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-2xl
              hover:bg-gray-200 active:scale-90 transition-all"
                    >
                        ✕
                    </button>
                    <button
                        onClick={onLike}
                        className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-primary-600
              flex items-center justify-center text-3xl text-white
              hover:shadow-lg hover:shadow-primary-500/30 active:scale-90 transition-all match-pulse"
                    >
                        ♥
                    </button>
                </div>
            )}
        </div>
    );
}
