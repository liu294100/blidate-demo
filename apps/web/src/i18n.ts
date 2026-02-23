import { getRequestConfig } from "next-intl/server";
import { locales, type Locale } from "@blinddate/i18n";

export default getRequestConfig(async ({ locale }) => {
    const validLocale = locales.includes(locale as Locale) ? locale : "zh";

    // 显式导入以支持 Next.js 的静态分析和打包
    const messages = (await (validLocale === "en"
        ? import("@blinddate/i18n/locales/en")
        : import("@blinddate/i18n/locales/zh")
    )).default;

    return {
        messages,
    };
});
