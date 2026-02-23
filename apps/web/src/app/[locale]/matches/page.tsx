"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { calculateAge } from "@/lib/utils";

interface MatchItem {
    id: string;
    isUnlocked: boolean;
    createdAt: string;
    otherUser: {
        id: string;
        name: string;
        gender: string;
        birthDate: string;
        avatarUrl: string | null;
        city: string | null;
        photos: string[];
    };
    lastMessage?: {
        content: string;
        createdAt: string;
    };
}

export default function MatchesPage() {
    const t = useTranslations();
    const { locale } = useParams();
    const router = useRouter();
    const [matches, setMatches] = useState<MatchItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = async () => {
        try {
            const res = await fetch("/api/matches");
            const data = await res.json();
            if (data.success) {
                setMatches(data.data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleClick = (match: MatchItem) => {
        if (match.isUnlocked) {
            router.push(`/${locale}/messages/${match.id}`);
        } else {
            router.push(`/${locale}/unlock/${match.id}`);
        }
    };

    return (
        <div className="page-container bg-gray-50">
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100 px-4 py-3">
                <h1 className="text-xl font-bold">{t("match.title")} 💕</h1>
            </div>

            <div className="p-4 space-y-3">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <p className="text-gray-400">{t("common.loading")}</p>
                    </div>
                ) : matches.length === 0 ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="text-5xl mb-3">💫</div>
                            <p className="text-gray-500">{t("match.noMatches")}</p>
                        </div>
                    </div>
                ) : (
                    matches.map((match) => {
                        const user = match.otherUser;
                        const age = calculateAge(new Date(user.birthDate));
                        const avatar = user.avatarUrl || (user.photos?.[0] ?? null);

                        return (
                            <button
                                key={match.id}
                                onClick={() => handleClick(match)}
                                className="w-full card !p-4 flex items-center gap-4 text-left
                  hover:scale-[1.02] active:scale-[0.98] transition-transform"
                            >
                                {/* Avatar */}
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex-shrink-0 overflow-hidden">
                                    {avatar ? (
                                        <img src={avatar} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl">
                                            {user.gender === "FEMALE" ? "👩" : "👨"}
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-gray-900">{user.name}</span>
                                        <span className="text-sm text-gray-400">{age}岁</span>
                                        {user.city && (
                                            <span className="text-xs text-gray-400">📍{user.city}</span>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-500 truncate mt-0.5">
                                        {match.lastMessage
                                            ? match.lastMessage.content
                                            : match.isUnlocked
                                                ? t("message.noMessages")
                                                : t("match.locked")}
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="flex-shrink-0">
                                    {match.isUnlocked ? (
                                        <span className="badge-success text-xs">{t("match.unlocked")}</span>
                                    ) : (
                                        <span className="badge-warning text-xs">🔒 {t("match.locked")}</span>
                                    )}
                                </div>
                            </button>
                        );
                    })
                )}
            </div>

            <BottomNav />
        </div>
    );
}
