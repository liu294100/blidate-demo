export const locales = ["zh", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "zh";

export function getMessages(locale: Locale) {
    return import(`../locales/${locale}.json`).then((m) => m.default);
}
