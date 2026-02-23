// Role labels
export const ROLE_LABELS: Record<string, Record<string, string>> = {
    USER: { zh: "普通用户", en: "User" },
    MATCHMAKER: { zh: "红娘", en: "Matchmaker" },
    ADMIN: { zh: "管理员", en: "Admin" },
};

// Education labels
export const EDUCATION_LABELS: Record<string, Record<string, string>> = {
    HIGH_SCHOOL: { zh: "高中", en: "High School" },
    ASSOCIATE: { zh: "大专", en: "Associate" },
    BACHELOR: { zh: "本科", en: "Bachelor" },
    MASTER: { zh: "硕士", en: "Master" },
    DOCTORATE: { zh: "博士", en: "Doctorate" },
    OTHER: { zh: "其他", en: "Other" },
};

// Gender labels
export const GENDER_LABELS: Record<string, Record<string, string>> = {
    MALE: { zh: "男", en: "Male" },
    FEMALE: { zh: "女", en: "Female" },
    OTHER: { zh: "其他", en: "Other" },
};

// Income ranges
export const INCOME_RANGES = [
    { value: "0-5k", label: { zh: "5千以下", en: "Below 5K" } },
    { value: "5k-10k", label: { zh: "5千-1万", en: "5K-10K" } },
    { value: "10k-20k", label: { zh: "1万-2万", en: "10K-20K" } },
    { value: "20k-30k", label: { zh: "2万-3万", en: "20K-30K" } },
    { value: "30k-50k", label: { zh: "3万-5万", en: "30K-50K" } },
    { value: "50k+", label: { zh: "5万以上", en: "Above 50K" } },
];

// Config defaults
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PHOTOS = 9;
export const DAILY_RECOMMEND_COUNT = 10;
export const UNLOCK_PRICE = 29.9;
export const SUPPORTED_LOCALES = ["zh", "en"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
