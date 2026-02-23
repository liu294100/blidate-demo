"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import BottomNav from "@/components/BottomNav";
import { calculateAge } from "@/lib/utils";

interface ProfileData {
    name: string;
    gender: string;
    birthDate: string;
    height: number | null;
    weight: number | null;
    education: string | null;
    occupation: string | null;
    income: string | null;
    bio: string | null;
    city: string | null;
    photos: string[];
    isVerified: boolean;
    contact: string | null;
    preference: {
        minAge: number;
        maxAge: number;
        genderPref: string | null;
        minHeight: number | null;
        educationPref: string | null;
        description: string | null;
    } | null;
}

const EDUCATION_LABELS: Record<string, string> = {
    HIGH_SCHOOL: "高中",
    ASSOCIATE: "大专",
    BACHELOR: "本科",
    MASTER: "硕士",
    DOCTORATE: "博士",
};

export default function ProfilePage() {
    const t = useTranslations();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/profile");
            const data = await res.json();
            if (data.success && data.data) {
                setProfile(data.data);
                setForm({
                    ...data.data,
                    preferenceDesc: data.data.preference?.description,
                    minAge: data.data.preference?.minAge,
                    maxAge: data.data.preference?.maxAge,
                    genderPref: data.data.preference?.genderPref,
                    minHeight: data.data.preference?.minHeight,
                    educationPref: data.data.preference?.educationPref,
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (data.success) {
                setProfile(data.data);
                setEditing(false);
                setMessage({ type: "success", text: t("profile.saveSuccess") });
            } else {
                setMessage({ type: "error", text: t("profile.saveError") });
            }
        } catch {
            setMessage({ type: "error", text: t("profile.saveError") });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/";
    };

    if (loading) {
        return (
            <div className="page-container flex items-center justify-center">
                <p className="text-gray-400">{t("common.loading")}</p>
            </div>
        );
    }

    return (
        <div className="page-container bg-gray-50">
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                <h1 className="text-xl font-bold">{t("profile.title")}</h1>
                <div className="flex items-center gap-2">
                    {!editing ? (
                        <button
                            onClick={() => setEditing(true)}
                            className="text-sm text-primary-600 font-medium"
                        >
                            {t("common.edit")}
                        </button>
                    ) : (
                        <button
                            onClick={handleSave}
                            className="text-sm text-primary-600 font-medium"
                            disabled={saving}
                        >
                            {saving ? t("common.loading") : t("common.save")}
                        </button>
                    )}
                </div>
            </div>

            {/* Toast */}
            {message && (
                <div
                    className={`mx-4 mt-3 p-3 rounded-lg text-sm animate-slide-up ${message.type === "success"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                >
                    {message.text}
                </div>
            )}

            <div className="p-4 space-y-4">
                {/* Avatar section */}
                <div className="card flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center text-3xl overflow-hidden">
                        {profile?.gender === "FEMALE" ? "👩" : "👨"}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{profile?.name}</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            {profile?.birthDate && (
                                <span>{calculateAge(new Date(profile.birthDate))}岁</span>
                            )}
                            {profile?.city && <span>📍 {profile.city}</span>}
                        </div>
                        {profile?.isVerified ? (
                            <span className="badge-success mt-1">{t("profile.verified")}</span>
                        ) : (
                            <span className="badge-warning mt-1">{t("profile.unverified")}</span>
                        )}
                    </div>
                </div>

                {/* Basic info */}
                <div className="card">
                    <h3 className="font-semibold mb-4">{t("profile.basicInfo")}</h3>
                    <div className="space-y-3">
                        {[
                            { key: "height", label: t("profile.height"), suffix: "cm", type: "number" },
                            { key: "weight", label: t("profile.weight"), suffix: "kg", type: "number" },
                            { key: "occupation", label: t("profile.occupation"), type: "text" },
                            { key: "income", label: t("profile.income"), type: "text" },
                            { key: "city", label: t("profile.city"), type: "text" },
                        ].map((field) => (
                            <div key={field.key} className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">{field.label}</span>
                                {editing ? (
                                    <input
                                        type={field.type}
                                        className="input-field !w-40 !py-1.5 text-sm text-right"
                                        value={form[field.key] || ""}
                                        onChange={(e) =>
                                            setForm((prev: Record<string, any>) => ({
                                                ...prev,
                                                [field.key]: field.type === "number" ? Number(e.target.value) : e.target.value,
                                            }))
                                        }
                                    />
                                ) : (
                                    <span className="text-sm font-medium">
                                        {profile?.[field.key as keyof ProfileData] || "—"}
                                        {profile?.[field.key as keyof ProfileData] && field.suffix
                                            ? ` ${field.suffix}`
                                            : ""}
                                    </span>
                                )}
                            </div>
                        ))}

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">{t("profile.education")}</span>
                            {editing ? (
                                <select
                                    className="input-field !w-40 !py-1.5 text-sm"
                                    value={form.education || ""}
                                    onChange={(e) =>
                                        setForm((prev: Record<string, any>) => ({ ...prev, education: e.target.value }))
                                    }
                                >
                                    <option value="">—</option>
                                    {Object.entries(EDUCATION_LABELS).map(([k, v]) => (
                                        <option key={k} value={k}>{v}</option>
                                    ))}
                                </select>
                            ) : (
                                <span className="text-sm font-medium">
                                    {profile?.education
                                        ? EDUCATION_LABELS[profile.education] || profile.education
                                        : "—"}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">联系方式 (仅运营可见)</span>
                            {editing ? (
                                <input
                                    type="text"
                                    className="input-field !w-40 !py-1.5 text-sm text-right"
                                    value={form.contact || ""}
                                    onChange={(e) =>
                                        setForm((prev: Record<string, any>) => ({ ...prev, contact: e.target.value }))
                                    }
                                    placeholder="微信号/手机号"
                                />
                            ) : (
                                <span className="text-sm font-medium text-gray-400">
                                    {profile?.contact || "—"}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bio */}
                <div className="card">
                    <h3 className="font-semibold mb-3">{t("profile.bio")}</h3>
                    {editing ? (
                        <textarea
                            className="input-field h-24 resize-none w-full p-2"
                            value={form.bio || ""}
                            onChange={(e) =>
                                setForm((prev: Record<string, any>) => ({ ...prev, bio: e.target.value }))
                            }
                            placeholder="介绍一下自己..."
                        />
                    ) : (
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {profile?.bio || "—"}
                        </p>
                    )}
                </div>

                {/* Preference Description */}
                <div className="card">
                    <h3 className="font-semibold mb-3">择偶要求</h3>
                    
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-500 block mb-1">最小年龄</label>
                                {editing ? (
                                    <input
                                        type="number"
                                        className="input-field w-full py-1.5 text-sm"
                                        value={form.minAge || ""}
                                        onChange={(e) => setForm(prev => ({ ...prev, minAge: e.target.value }))}
                                    />
                                ) : (
                                    <span className="text-sm font-medium">{profile?.preference?.minAge || "18"}岁</span>
                                )}
                            </div>
                            <div>
                                <label className="text-sm text-gray-500 block mb-1">最大年龄</label>
                                {editing ? (
                                    <input
                                        type="number"
                                        className="input-field w-full py-1.5 text-sm"
                                        value={form.maxAge || ""}
                                        onChange={(e) => setForm(prev => ({ ...prev, maxAge: e.target.value }))}
                                    />
                                ) : (
                                    <span className="text-sm font-medium">{profile?.preference?.maxAge || "60"}岁</span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-500 block mb-1">性别偏好</label>
                                {editing ? (
                                    <select
                                        className="input-field w-full py-1.5 text-sm"
                                        value={form.genderPref || ""}
                                        onChange={(e) => setForm(prev => ({ ...prev, genderPref: e.target.value }))}
                                    >
                                        <option value="">不限</option>
                                        <option value="MALE">男</option>
                                        <option value="FEMALE">女</option>
                                    </select>
                                ) : (
                                    <span className="text-sm font-medium">
                                        {profile?.preference?.genderPref === 'MALE' ? '男' : 
                                         profile?.preference?.genderPref === 'FEMALE' ? '女' : '不限'}
                                    </span>
                                )}
                            </div>
                            <div>
                                <label className="text-sm text-gray-500 block mb-1">最低身高</label>
                                {editing ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            className="input-field w-full py-1.5 text-sm"
                                            value={form.minHeight || ""}
                                            onChange={(e) => setForm(prev => ({ ...prev, minHeight: e.target.value }))}
                                        />
                                        <span className="text-sm text-gray-500">cm</span>
                                    </div>
                                ) : (
                                    <span className="text-sm font-medium">
                                        {profile?.preference?.minHeight ? `${profile.preference.minHeight}cm` : "不限"}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-gray-500 block mb-1">学历要求</label>
                            {editing ? (
                                <select
                                    className="input-field w-full py-1.5 text-sm"
                                    value={form.educationPref || ""}
                                    onChange={(e) => setForm(prev => ({ ...prev, educationPref: e.target.value }))}
                                >
                                    <option value="">不限</option>
                                    {Object.entries(EDUCATION_LABELS).map(([k, v]) => (
                                        <option key={k} value={k}>{v}及以上</option>
                                    ))}
                                </select>
                            ) : (
                                <span className="text-sm font-medium">
                                    {profile?.preference?.educationPref 
                                        ? `${EDUCATION_LABELS[profile.preference.educationPref] || profile.preference.educationPref}及以上` 
                                        : "不限"}
                                </span>
                            )}
                        </div>

                        <div>
                            <label className="text-sm text-gray-500 block mb-1">具体描述</label>
                            {editing ? (
                                <textarea
                                    className="input-field h-24 resize-none w-full p-2"
                                    value={form.preferenceDesc || ""}
                                    onChange={(e) =>
                                        setForm((prev: Record<string, any>) => ({ ...prev, preferenceDesc: e.target.value }))
                                    }
                                    placeholder="描述你理想的另一半..."
                                />
                            ) : (
                                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg">
                                    {profile?.preference?.description || "暂无描述"}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="w-full py-3 text-center text-red-500 text-sm font-medium hover:bg-red-50 rounded-xl transition-colors"
                >
                    {t("auth.logout")}
                </button>
            </div>

            <BottomNav />
        </div>
    );
}
