"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

interface MessagePreview {
    matchId: string;
    otherUserName: string;
    otherUserGender: string;
    lastMessage: string;
    lastMessageTime: string;
    isUnlocked: boolean;
}

export default function MessagesListPage() {
    const t = useTranslations();
    const { locale } = useParams();
    const router = useRouter();
    const [conversations, setConversations] = useState<MessagePreview[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            const res = await fetch("/api/matches");
            const data = await res.json();
            if (data.success) {
                const unlocked = (data.data || [])
                    .filter((m: any) => m.isUnlocked)
                    .map((m: any) => ({
                        matchId: m.id,
                        otherUserName: m.otherUser.name,
                        otherUserGender: m.otherUser.gender,
                        lastMessage: m.lastMessage?.content || "",
                        lastMessageTime: m.lastMessage?.createdAt || m.createdAt,
                        isUnlocked: m.isUnlocked,
                    }));
                setConversations(unlocked);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container bg-gray-50">
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100 px-4 py-3">
                <h1 className="text-xl font-bold">{t("message.title")} 💬</h1>
            </div>

            <div className="p-4 space-y-3">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <p className="text-gray-400">{t("common.loading")}</p>
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="text-5xl mb-3">💬</div>
                            <p className="text-gray-500">{t("message.noMessages")}</p>
                        </div>
                    </div>
                ) : (
                    conversations.map((conv) => (
                        <button
                            key={conv.matchId}
                            onClick={() => router.push(`/${locale}/messages/${conv.matchId}`)}
                            className="w-full card !p-4 flex items-center gap-4 text-left
                hover:scale-[1.02] active:scale-[0.98] transition-transform"
                        >
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center text-xl">
                                {conv.otherUserGender === "FEMALE" ? "👩" : "👨"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-900">{conv.otherUserName}</div>
                                <p className="text-sm text-gray-500 truncate">
                                    {conv.lastMessage || t("message.noMessages")}
                                </p>
                            </div>
                            <span className="text-xs text-gray-400">
                                {new Date(conv.lastMessageTime).toLocaleDateString()}
                            </span>
                        </button>
                    ))
                )}
            </div>

            <BottomNav />
        </div>
    );
}
