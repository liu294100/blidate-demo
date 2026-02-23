"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";

interface Message {
    id: string;
    senderId: string;
    content: string;
    type: string;
    createdAt: string;
}

export default function MessagesPage() {
    const t = useTranslations();
    const { locale, matchId } = useParams();
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [matchInfo, setMatchInfo] = useState<any>(null);
    const [currentUserId, setCurrentUserId] = useState("");
    const [loading, setLoading] = useState(true);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // poll every 5s
        return () => clearInterval(interval);
    }, [matchId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`/api/messages/${matchId}`);
            const data = await res.json();
            if (data.success) {
                setMessages(data.data.messages || []);
                setMatchInfo(data.data.match);
                setCurrentUserId(data.data.currentUserId);

                if (!data.data.match.isUnlocked) {
                    router.push(`/${locale}/unlock/${matchId}`);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!newMessage.trim()) return;

        try {
            const res = await fetch(`/api/messages/${matchId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newMessage }),
            });
            const data = await res.json();
            if (data.success) {
                setMessages((prev) => [...prev, data.data]);
                setNewMessage("");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="max-w-md mx-auto min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100 px-4 py-3 flex items-center gap-3">
                <button
                    onClick={() => router.push(`/${locale}/matches`)}
                    className="text-gray-500 hover:text-gray-900 transition-colors"
                >
                    ← {t("common.back")}
                </button>
                {matchInfo && (
                    <span className="font-semibold">{matchInfo.otherUserName}</span>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <p className="text-gray-400">{t("common.loading")}</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="text-4xl mb-2">💬</div>
                            <p className="text-gray-400 text-sm">{t("message.noMessages")}</p>
                        </div>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMine = msg.senderId === currentUserId;
                        return (
                            <div
                                key={msg.id}
                                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMine
                                            ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-br-md"
                                            : "bg-white text-gray-800 border border-gray-100 rounded-bl-md"
                                        }`}
                                >
                                    {msg.content}
                                    <div
                                        className={`text-[10px] mt-1 ${isMine ? "text-white/60" : "text-gray-400"
                                            }`}
                                    >
                                        {new Date(msg.createdAt).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-3">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        className="input-field !py-2.5 !rounded-full"
                        placeholder={t("message.inputPlaceholder")}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        onClick={handleSend}
                        className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white
              flex items-center justify-center flex-shrink-0
              hover:shadow-lg active:scale-90 transition-all disabled:opacity-50"
                        disabled={!newMessage.trim()}
                    >
                        ↑
                    </button>
                </div>
            </div>
        </div>
    );
}
