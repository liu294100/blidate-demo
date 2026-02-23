"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

export default function LangSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const switchLocale = (newLocale: string) => {
        const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
        router.push(newPath);
    };

    return (
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
            <button
                onClick={() => switchLocale("zh")}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${locale === "zh"
                        ? "bg-white text-primary-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
            >
                中文
            </button>
            <button
                onClick={() => switchLocale("en")}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${locale === "en"
                        ? "bg-white text-primary-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
            >
                EN
            </button>
        </div>
    );
}
