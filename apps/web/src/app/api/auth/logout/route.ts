import { successResponse } from "@/lib/utils";
import { cookies } from "next/headers";

export async function POST() {
    const cookieStore = await cookies();
    cookieStore.delete("auth-token");
    return successResponse(null, "Logged out");
}
