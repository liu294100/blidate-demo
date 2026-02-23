"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import LangSwitcher from "@/components/LangSwitcher";

export default function LoginPage() {
    const t = useTranslations();
    const { locale } = useParams();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!data.success) {
                setError(data.error || t("auth.loginError"));
                return;
            }

            router.push(`/${locale}/discover`);
            router.refresh();
        } catch {
            setError(t("auth.loginError"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex flex-col">
            <div className="p-4 flex justify-between items-center">
                <Link href={`/${locale}`} className="text-xl font-bold gradient-text">
                    {t("common.appName")}
                </Link>
                <LangSwitcher />
            </div>

            <div className="flex-1 flex items-center justify-center px-4 pb-10">
                <div className="w-full max-w-sm animate-slide-up">
                    <div className="text-center mb-8">
                        <div className="text-5xl mb-4">💕</div>
                        <h2 className="text-2xl font-bold text-gray-900">{t("auth.login")}</h2>
                        <p className="text-gray-500 mt-2">欢迎回来</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label-text">{t("auth.email")}</label>
                            <input
                                type="email"
                                className="input-field"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="label-text">{t("auth.password")}</label>
                            <input
                                type="password"
                                className="input-field"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn-primary w-full"
                            disabled={loading}
                        >
                            {loading ? t("common.loading") : t("auth.login")}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-sm text-gray-500">
                        {t("auth.noAccount")}{" "}
                        <Link
                            href={`/${locale}/auth/register`}
                            className="text-primary-600 font-medium hover:underline"
                        >
                            {t("auth.register")}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
