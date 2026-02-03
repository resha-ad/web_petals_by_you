import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, getUserData } from "@/lib/cookie";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = await getAuthToken();
    const user = token ? await getUserData() : null;

    console.log("[Middleware] Path:", pathname);
    console.log("[Middleware] Token exists:", !!token);
    console.log("[Middleware] User data:", user ? user.role : "No user");

    // Public routes - allow without login
    const publicRoutes = ["/", "/login", "/register"];
    if (publicRoutes.includes(pathname) || pathname.startsWith("/(auth)")) {
        // If logged in, redirect away from login/register
        if (token && (pathname === "/login" || pathname === "/register")) {
            const redirectTo = user?.role === "admin" ? "/admin" : "/user/dashboard";
            console.log("[Middleware] Redirecting logged-in user from auth page to:", redirectTo);
            return NextResponse.redirect(new URL(redirectTo, request.url));
        }
        return NextResponse.next();
    }

    // All other routes require login
    if (!token) {
        console.log("[Middleware] No token - redirect to login");
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Admin routes require admin role
    if (pathname.startsWith("/admin")) {
        if (user?.role !== "admin") {
            console.log("[Middleware] Non-admin trying admin route - redirect to dashboard");
            return NextResponse.redirect(new URL("/user/dashboard", request.url));
        }
        return NextResponse.next();
    }

    // User routes - allow "user" and "admin"
    if (pathname.startsWith("/user")) {
        const allowedRoles = ["user", "admin"];
        const currentRole = user?.role ?? "unknown";
        if (!allowedRoles.includes(currentRole)) {
            console.log("[Middleware] Invalid role for /user/*:", currentRole, "- redirect to home");
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    }

    // Default: allow
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