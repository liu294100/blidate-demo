"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";

export default function UnlockPage() {
    const t = useTranslations();
    const { locale, matchId } = useParams();
    const router = useRouter();
    const [tab, setTab] = useState<"pay" | "matchmaker">("pay");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const handlePayUnlock = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/unlock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ matchId, paymentType: "PAYMENT" }),
            });
            const data = await res.json();
            if (data.success) {
                setResult("success");
                setTimeout(() => router.push(`/${locale}/messages/${matchId}`), 1500);
            } else {
                setResult("error");
            }
        } catch {
            setResult("error");
        } finally {
            setLoading(false);
        }
    };

    const handleMatchmakerRequest = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/matchmaker-request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ matchId, notes }),
            });
            const data = await res.json();
            if (data.success) {
                setResult("matchmaker-success");
            } else {
                setResult("error");
            }
        } catch {
            setResult("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto min-h-screen bg-gray-50">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100 px-4 py-3 flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="text-gray-500 hover:text-gray-900 transition-colors"
                >
                    ← {t("common.back")}
                </button>
                <h1 className="font-semibold">{t("unlock.title")}</h1>
            </div>

            <div className="p-4">
                {/* Success states */}
                {result === "success" && (
                    <div className="card text-center py-10 animate-scale-in">
                        <div className="text-5xl mb-4">🎉</div>
                        <h3 className="text-xl font-bold text-emerald-600">
                            {t("unlock.paymentSuccess")}
                        </h3>
                    </div>
                )}

                {result === "matchmaker-success" && (
                    <div className="card text-center py-10 animate-scale-in">
                        <div className="text-5xl mb-4">✅</div>
                        <h3 className="text-xl font-bold text-emerald-600">
                            {t("unlock.requestSubmitted")}
                        </h3>
                        <button
                            onClick={() => router.push(`/${locale}/matches`)}
                            className="btn-primary mt-6"
                        >
                            {t("common.back")}
                        </button>
                    </div>
                )}

                {result === "error" && (
                    <div className="card text-center py-10 animate-scale-in">
                        <div className="text-5xl mb-4">❌</div>
                        <h3 className="text-xl font-bold text-red-500">
                            {t("unlock.paymentFailed")}
                        </h3>
                        <button
                            onClick={() => setResult(null)}
                            className="btn-secondary mt-6"
                        >
                            重试
                        </button>
                    </div>
                )}

                {/* Normal state */}
                {!result && (
                    <>
                        {/* Tabs */}
                        <div className="flex bg-white rounded-xl p-1 mb-6 border border-gray-100">
                            <button
                                onClick={() => setTab("pay")}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === "pay"
                                        ? "bg-primary-500 text-white shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                💳 {t("unlock.payToUnlock")}
                            </button>
                            <button
                                onClick={() => setTab("matchmaker")}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === "matchmaker"
                                        ? "bg-primary-500 text-white shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                💝 {t("unlock.matchmakerService")}
                            </button>
                        </div>

                        {tab === "pay" ? (
                            <div className="card text-center">
                                <div className="text-4xl mb-4">🔓</div>
                                <h3 className="text-lg font-semibold mb-2">
                                    {t("unlock.payToUnlock")}
                                </h3>
                                <p className="text-gray-500 text-sm mb-6">
                                    {t("unlock.payDesc")}
                                </p>
                                <div className="text-3xl font-bold gradient-text mb-6">
                                    ¥29.9
                                </div>
                                <button
                                    onClick={handlePayUnlock}
                                    className="btn-primary w-full"
                                    disabled={loading}
                                >
                                    {loading ? t("common.loading") : `确认支付 ¥29.9`}
                                </button>
                                <p className="text-xs text-gray-400 mt-3">
                                    * Phase 1 模拟支付，不会真实扣款
                                </p>
                            </div>
                        ) : (
                            <div className="card">
                                <div className="text-center mb-6">
                                    <div className="text-4xl mb-4">💝</div>
                                    <h3 className="text-lg font-semibold mb-2">
                                        {t("unlock.matchmakerService")}
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        {t("unlock.matchmakerDesc")}
                                    </p>
                                </div>
                                <div>
                                    <label className="label-text">{t("unlock.notes")}</label>
                                    <textarea
                                        className="input-field h-28 resize-none"
                                        placeholder={t("unlock.notesPlaceholder")}
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={handleMatchmakerRequest}
                                    className="btn-accent w-full mt-4"
                                    disabled={loading}
                                >
                                    {loading ? t("common.loading") : t("unlock.contactMatchmaker")}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
