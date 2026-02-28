// app/api/logout/route.ts
// Must live in app/api/ for Next.js to expose it as POST /api/logout

import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/cookie";

export async function POST() {
    try {
        await clearAuthCookies();
        console.log("[/api/logout] Cookies cleared successfully");
    } catch (err) {
        console.error("[/api/logout] Failed to clear cookies:", err);
        // Still return success so the client always redirects to login
    }
    return NextResponse.json({ success: true });
}