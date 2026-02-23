import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = new TextEncoder().encode(
    process.env.NEXTAUTH_SECRET || "blinddate-secret-key-change-me"
);

export interface AdminSession {
    id: string;
    email: string;
    role: string;
}

export async function verifyAdminToken(token: string): Promise<AdminSession | null> {
    try {
        const { payload } = await jwtVerify(token, secretKey);
        if ((payload as any).role !== "ADMIN") return null;
        return payload as unknown as AdminSession;
    } catch {
        return null;
    }
}

export async function getAdminSession(): Promise<AdminSession | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;
    if (!token) return null;
    return verifyAdminToken(token);
}

export async function createAdminToken(user: AdminSession): Promise<string> {
    return new SignJWT({ ...user })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(secretKey);
}
