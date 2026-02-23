// ========================
// User & Auth Types
// ========================

export type UserRole = "USER" | "MATCHMAKER" | "ADMIN";
export type UserStatus = "ACTIVE" | "BANNED" | "INACTIVE";
export type Gender = "MALE" | "FEMALE" | "OTHER";

export type Education =
    | "HIGH_SCHOOL"
    | "ASSOCIATE"
    | "BACHELOR"
    | "MASTER"
    | "DOCTORATE"
    | "OTHER";

export interface UserPublicProfile {
    id: string;
    name: string;
    gender: Gender;
    age: number;
    height?: number;
    weight?: number;
    education?: Education;
    occupation?: string;
    income?: string;
    bio?: string;
    city?: string;
    photos: string[];
    avatarUrl?: string;
    isVerified: boolean;
}

export interface UserFullProfile extends UserPublicProfile {
    email?: string;
    phone?: string;
    province?: string;
    country?: string;
    birthDate: string;
}

// ========================
// Match Types
// ========================

export type PaymentType = "PAYMENT" | "MATCHMAKER";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
export type MatchmakerRequestStatus =
    | "PENDING"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";
export type ModerationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface MatchInfo {
    id: string;
    otherUser: UserPublicProfile;
    isUnlocked: boolean;
    unlockedAt?: string;
    createdAt: string;
    lastMessage?: {
        content: string;
        createdAt: string;
    };
}

export interface MessageInfo {
    id: string;
    senderId: string;
    content: string;
    type: "TEXT" | "EMOJI" | "IMAGE" | "SYSTEM";
    readAt?: string;
    createdAt: string;
}

// ========================
// API Types
// ========================

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface RegisterInput {
    email?: string;
    phone?: string;
    password: string;
    name: string;
    gender: Gender;
    birthDate: string;
}

export interface LoginInput {
    email?: string;
    phone?: string;
    password: string;
}

export interface ProfileUpdateInput {
    name?: string;
    height?: number;
    weight?: number;
    education?: Education;
    occupation?: string;
    income?: string;
    bio?: string;
    city?: string;
    province?: string;
    country?: string;
}

export interface MatchPreferenceInput {
    minAge?: number;
    maxAge?: number;
    minHeight?: number;
    maxHeight?: number;
    genderPref?: Gender;
    educationPref?: Education;
    cityPref?: string;
}

export interface DiscoverFilters {
    gender?: Gender;
    minAge?: number;
    maxAge?: number;
    city?: string;
    education?: Education;
    page?: number;
    pageSize?: number;
}

// ========================
// Admin Types
// ========================

export interface AdminUserInfo {
    id: string;
    email?: string;
    phone?: string;
    role: UserRole;
    status: UserStatus;
    locale: string;
    createdAt: string;
    profile?: UserPublicProfile;
}

export interface AdminStats {
    totalUsers: number;
    activeUsers: number;
    totalMatches: number;
    pendingModeration: number;
    pendingMatchmakerRequests: number;
    totalRevenue: number;
}
