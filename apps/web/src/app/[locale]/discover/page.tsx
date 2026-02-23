"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import BottomNav from "@/components/BottomNav";
import ProfileCard from "@/components/ProfileCard";
import LangSwitcher from "@/components/LangSwitcher";

interface DiscoverProfile {
    id: string;
    name: string;
    gender: string;
    birthDate: string;
    height: number | null;
    education: string | null;
    occupation: string | null;
    city: string | null;
    bio: string | null;
    photos: string[];
    avatarUrl: string | null;
    isVerified: boolean;
}

export default function DiscoverPage() {
    const t = useTranslations();
    const [profiles, setProfiles] = useState<DiscoverProfile[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [matchPopup, setMatchPopup] = useState<string | null>(null);

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        try {
            const res = await fetch("/api/discover");
            const data = await res.json();
            if (data.success) {
                setProfiles(data.data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        const profile = profiles[currentIndex];
        if (!profile) return;

        try {
            const res = await fetch("/api/like", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ toUserId: profile.id }),
            });
            const data = await res.json();

            if (data.data?.matched) {
                setMatchPopup(profile.name);
                setTimeout(() => setMatchPopup(null), 3000);
            }
        } catch (err) {
            console.error(err);
        }

        setCurrentIndex((prev) => prev + 1);
    };

    const handleDislike = () => {
        setCurrentIndex((prev) => prev + 1);
    };

    const currentProfile = profiles[currentIndex];

    return (
        <div className="page-container bg-gray-50">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100 px-4 py-3">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold gradient-text">{t("common.appName")}</h1>
                    <LangSwitcher />
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    {t("discover.dailyRecommend")} ✨
                </h2>

                {loading ? (
                    <div className="flex items-center justify-center h-96">
                        <div className="text-center">
                            <div className="text-4xl mb-4 animate-heart-beat">💕</div>
                            <p className="text-gray-400">{t("common.loading")}</p>
                        </div>
                    </div>
                ) : !currentProfile ? (
                    <div className="flex items-center justify-center h-96">
                        <div className="text-center">
                            <div className="text-6xl mb-4">🎉</div>
                            <p className="text-gray-500 font-medium">{t("discover.noMore")}</p>
                        </div>
                    </div>
                ) : (
                    <ProfileCard
                        profile={currentProfile as any}
                        onLike={handleLike}
                        onDislike={handleDislike}
                    />
                )}
            </div>

            {/* Match Popup */}
            {matchPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl p-8 text-center max-w-xs mx-4 animate-scale-in">
                        <div className="text-6xl mb-4 animate-heart-beat">💕</div>
                        <h3 className="text-2xl font-bold gradient-text mb-2">
                            {t("discover.itsAMatch")}
                        </h3>
                        <p className="text-gray-500">
                            {t("discover.matchDesc", { name: matchPopup })}
                        </p>
                        <p className="text-sm text-primary-400 mt-3">
                            {t("discover.unlockToChat")}
                        </p>
                    </div>
                </div>
            )}

            <BottomNav />
        </div>
    );
}
