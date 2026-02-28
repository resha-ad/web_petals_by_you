import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname
    console.log('\n[Proxy] ========== NEW REQUEST ==========')
    console.log('[Proxy] Path:', path)
    console.log('[Proxy] Method:', request.method)

    // Get token from cookies
    const token = request.cookies.get('auth_token')?.value
    const userDataCookie = request.cookies.get('user_data')?.value

    console.log('[Proxy] auth_token exists:', !!token)
    console.log('[Proxy] auth_token value (first 20 chars):', token?.slice(0, 20) ?? 'NONE')
    console.log('[Proxy] user_data cookie exists:', !!userDataCookie)

    let userData = null
    try {
        userData = userDataCookie ? JSON.parse(userDataCookie) : null
        console.log('[Proxy] Parsed user role:', userData?.role ?? 'NONE')
        console.log('[Proxy] Parsed username:', userData?.username ?? 'NONE')
    } catch (e) {
        console.error('[Proxy] Failed to parse user_data cookie:', e)
    }

    // Define auth routes (login/register)
    const isAuthRoute = path === '/login' || path === '/register'

    // Define protected routes that require authentication
    const isProtectedRoute =
        path.startsWith('/user') ||
        path === '/cart' ||
        path === '/favorites' ||
        path.startsWith('/checkout')

    // Define admin-only routes
    const isAdminRoute = path.startsWith('/admin')

    console.log('[Proxy] Route flags → isAuth:', isAuthRoute, '| isProtected:', isProtectedRoute, '| isAdmin:', isAdminRoute)

    // If user is logged in and trying to access auth routes, redirect to dashboard
    if (token && isAuthRoute) {
        const destination = userData?.role === 'admin' ? '/admin' : '/user/dashboard'
        console.log('[Proxy] ⚠ Logged-in user hitting auth route → redirecting to', destination)
        return NextResponse.redirect(new URL(destination, request.url))
    }

    // If user is not logged in and trying to access protected routes, redirect to login
    if (!token && isProtectedRoute) {
        console.log('[Proxy] ⚠ No token on protected route → redirecting to /login')
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('callbackUrl', path)
        return NextResponse.redirect(loginUrl)
    }

    // If non-admin tries to access admin routes
    if (token && isAdminRoute && userData?.role !== 'admin') {
        console.log('[Proxy] ⚠ Non-admin on admin route → redirecting to /user/dashboard')
        return NextResponse.redirect(new URL('/user/dashboard', request.url))
    }

    console.log('[Proxy] ✓ Allowing access to:', path)
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|uploads|public).*)',
    ]
}