"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

const navItems = [
    { key: "discover", icon: "🔍", href: "/discover" },
    { key: "matches", icon: "💕", href: "/matches" },
    { key: "messages", icon: "💬", href: "/messages" },
    { key: "profile", icon: "👤", href: "/profile" },
];

export default function BottomNav() {
    const t = useTranslations("nav");
    const { locale } = useParams();
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 z-50">
            <div className="max-w-md mx-auto flex items-center justify-around py-2">
                {navItems.map((item) => {
                    const fullPath = `/${locale}${item.href}`;
                    const isActive = pathname.startsWith(fullPath);

                    return (
                        <Link
                            key={item.key}
                            href={fullPath}
                            className={`nav-link ${isActive ? "active" : ""}`}
                        >
                            <span className={`text-xl ${isActive ? "scale-110" : ""} transition-transform`}>
                                {item.icon}
                            </span>
                            <span className="text-[10px] font-medium">{t(item.key)}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
