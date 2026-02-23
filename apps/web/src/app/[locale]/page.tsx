"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import LangSwitcher from "@/components/LangSwitcher";

export default function HomePage() {
    const t = useTranslations();
    const { locale } = useParams();

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                    <h1 className="text-xl font-bold gradient-text">{t("common.appName")}</h1>
                    <div className="flex items-center gap-3">
                        <LangSwitcher />
                        <Link
                            href={`/${locale}/auth/login`}
                            className="text-sm font-medium text-gray-600 hover:text-primary-500 transition-colors"
                        >
                            {t("auth.login")}
                        </Link>
                        <Link
                            href={`/${locale}/auth/register`}
                            className="btn-primary text-sm !py-2 !px-4"
                        >
                            {t("auth.register")}
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50" />
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" />
                <div className="absolute top-40 right-10 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: "1s" }} />

                <div className="relative max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6 animate-fade-in">
                        <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                        智能匹配 · 安全可靠
                    </div>

                    <h2 className="text-5xl md:text-7xl font-extrabold mb-6 animate-slide-up">
                        <span className="gradient-text">{t("landing.hero")}</span>
                    </h2>

                    <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.2s" }}>
                        {t("landing.heroDesc")}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.4s" }}>
                        <Link href={`/${locale}/auth/register`} className="btn-primary text-lg !py-4 !px-8">
                            {t("landing.startNow")} →
                        </Link>
                        <a href="#features" className="btn-secondary text-lg !py-4 !px-8">
                            {t("landing.learnMore")}
                        </a>
                    </div>

                    <div className="mt-16 flex justify-center gap-8 text-center animate-fade-in" style={{ animationDelay: "0.6s" }}>
                        {[
                            { num: "10K+", label: "活跃用户" },
                            { num: "5K+", label: "成功匹配" },
                            { num: "98%", label: "满意度" },
                        ].map((stat) => (
                            <div key={stat.label}>
                                <div className="text-3xl font-bold gradient-text">{stat.num}</div>
                                <div className="text-sm text-gray-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-20 px-4 bg-white">
                <div className="max-w-5xl mx-auto">
                    <h3 className="text-3xl font-bold text-center mb-12">
                        为什么选择 <span className="gradient-text">{t("common.appName")}</span>
                    </h3>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: "💡",
                                title: t("landing.feature1Title"),
                                desc: t("landing.feature1Desc"),
                                gradient: "from-primary-500 to-pink-500",
                            },
                            {
                                icon: "🛡️",
                                title: t("landing.feature2Title"),
                                desc: t("landing.feature2Desc"),
                                gradient: "from-blue-500 to-indigo-500",
                            },
                            {
                                icon: "💝",
                                title: t("landing.feature3Title"),
                                desc: t("landing.feature3Desc"),
                                gradient: "from-accent-400 to-red-500",
                            },
                        ].map((feature) => (
                            <div
                                key={feature.title}
                                className="card group hover:scale-105 transition-transform duration-300 cursor-default"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                                    {feature.icon}
                                </div>
                                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                                <p className="text-gray-500">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4 bg-gradient-to-r from-primary-500 to-accent-500">
                <div className="max-w-3xl mx-auto text-center text-white">
                    <h3 className="text-4xl font-bold mb-4">准备好开始了吗？</h3>
                    <p className="text-lg opacity-90 mb-8">加入我们，找到属于你的那个人</p>
                    <Link
                        href={`/${locale}/auth/register`}
                        className="inline-block bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors shadow-xl"
                    >
                        {t("landing.startNow")}
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-10 px-4">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="text-xl font-bold text-white mb-2">{t("common.appName")}</div>
                    <p className="text-sm">© 2026 BlindDate. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
