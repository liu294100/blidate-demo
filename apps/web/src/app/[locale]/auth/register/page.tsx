"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import LangSwitcher from "@/components/LangSwitcher";

export default function RegisterPage() {
    const t = useTranslations();
    const { locale } = useParams();
    const router = useRouter();

    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        gender: "",
        birthDate: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const setField = (field: string, value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirmPassword) {
            setError(t("auth.passwordMismatch"));
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password,
                    name: form.name,
                    gender: form.gender,
                    birthDate: form.birthDate,
                }),
            });

            const data = await res.json();

            if (!data.success) {
                setError(data.error || t("auth.registerError"));
                return;
            }

            router.push(`/${locale}/profile`);
            router.refresh();
        } catch {
            setError(t("auth.registerError"));
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
                        <div className="text-5xl mb-4">✨</div>
                        <h2 className="text-2xl font-bold text-gray-900">{t("auth.register")}</h2>
                        <p className="text-gray-500 mt-2">开始你的寻爱之旅</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label-text">{t("profile.name")} *</label>
                            <input
                                type="text"
                                className="input-field"
                                value={form.name}
                                onChange={(e) => setField("name", e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="label-text">{t("auth.email")} *</label>
                            <input
                                type="email"
                                className="input-field"
                                placeholder="your@email.com"
                                value={form.email}
                                onChange={(e) => setField("email", e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="label-text">{t("profile.gender")} *</label>
                                <select
                                    className="input-field"
                                    value={form.gender}
                                    onChange={(e) => setField("gender", e.target.value)}
                                    required
                                >
                                    <option value="">选择</option>
                                    <option value="MALE">男</option>
                                    <option value="FEMALE">女</option>
                                </select>
                            </div>
                            <div>
                                <label className="label-text">{t("profile.birthDate")} *</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    value={form.birthDate}
                                    onChange={(e) => setField("birthDate", e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label-text">{t("auth.password")} *</label>
                            <input
                                type="password"
                                className="input-field"
                                placeholder="至少6位"
                                value={form.password}
                                onChange={(e) => setField("password", e.target.value)}
                                minLength={6}
                                required
                            />
                        </div>

                        <div>
                            <label className="label-text">{t("auth.confirmPassword")} *</label>
                            <input
                                type="password"
                                className="input-field"
                                placeholder="再次输入密码"
                                value={form.confirmPassword}
                                onChange={(e) => setField("confirmPassword", e.target.value)}
                                minLength={6}
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
                            {loading ? t("common.loading") : t("auth.register")}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-sm text-gray-500">
                        {t("auth.hasAccount")}{" "}
                        <Link
                            href={`/${locale}/auth/login`}
                            className="text-primary-600 font-medium hover:underline"
                        >
                            {t("auth.login")}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
