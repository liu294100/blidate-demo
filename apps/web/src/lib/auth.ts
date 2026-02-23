import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@blinddate/database";

const secretKey = new TextEncoder().encode(
    process.env.NEXTAUTH_SECRET || "blinddate-secret-key-change-me"
);

export interface SessionUser {
    id: string;
    email: string;
    role: string;
    locale: string;
}

export async function createToken(user: SessionUser): Promise<string> {
    return new SignJWT({ ...user })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secretKey);
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
    try {
        const { payload } = await jwtVerify(token, secretKey);
        return payload as unknown as SessionUser;
    } catch {
        return null;
    }
}

export async function getSession(): Promise<SessionUser | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    if (!token) return null;
    return verifyToken(token);
}

export async function getCurrentUser() {
    const session = await getSession();
    if (!session) return null;

    const user = await prisma.user.findUnique({
        where: { id: session.id },
        include: { profile: true, matchPreference: true },
    });

    return user;
}

export function requireAuth(session: SessionUser | null): SessionUser {
    if (!session) {
        throw new Error("Unauthorized");
    }
    return session;
}

export function requireAdmin(session: SessionUser | null): SessionUser {
    const user = requireAuth(session);
    if (user.role !== "ADMIN") {
        throw new Error("Forbidden");
    }
    return user;
}
