import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, getUserData } from "@/lib/cookie";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = await getAuthToken();
    const user = token ? await getUserData() : null;

    // Public routes - allow without login
    const publicRoutes = ["/", "/login", "/register"];
    if (publicRoutes.includes(pathname) || pathname.startsWith("/(auth)")) {
        // If already logged in, redirect away from login/register
        if (token && (pathname === "/login" || pathname === "/register")) {
            const redirectTo = user?.role === "admin" ? "/admin" : "/user/dashboard";
            return NextResponse.redirect(new URL(redirectTo, request.url));
        }
        return NextResponse.next();
    }

    // All other routes require login
    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Admin routes require admin role
    if (pathname.startsWith("/admin") && user?.role !== "admin") {
        return NextResponse.redirect(new URL("/user/dashboard", request.url));
    }

    // User routes - allow both "user" and "admin" (or restrict to user only if you prefer)
    if (pathname.startsWith("/user") && !["user", "admin"].includes(user?.role ?? "")) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/user/:path*",
        "/login",
        "/register",
        "/",
    ],
};