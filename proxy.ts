import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAuthToken, getUserData } from '@/lib/cookie'

export async function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname
    console.log('[Middleware] Path:', path)

    // Get token from cookies
    const token = request.cookies.get('auth_token')?.value
    const userDataCookie = request.cookies.get('user_data')?.value
    let userData = null

    try {
        userData = userDataCookie ? JSON.parse(userDataCookie) : null
    } catch (e) {
        console.error('[Middleware] Failed to parse user_data cookie:', e)
    }

    console.log('[Middleware] Token exists:', !!token)
    console.log('[Middleware] User role:', userData?.role)

    // Define public routes that don't require authentication
    const isPublicRoute =
        path === '/' ||
        path.startsWith('/shop') ||
        path.startsWith('/products') ||
        path.startsWith('/about') ||
        path.startsWith('/contact') ||
        path.match(/^\/product\/[^\/]+$/) // matches /product/something

    // Define auth routes (login/register)
    const isAuthRoute = path === '/login' || path === '/register'

    // Define protected routes that require authentication
    const isProtectedRoute =
        path.startsWith('/user') ||
        path === '/cart' ||
        path === '/favorites' ||
        path === '/build-bouquet' ||
        path.startsWith('/checkout')

    // Define admin-only routes
    const isAdminRoute = path.startsWith('/admin')

    // If user is logged in and trying to access auth routes (login/register), redirect to dashboard
    if (token && isAuthRoute) {
        console.log('[Middleware] Redirecting logged-in user from auth page to dashboard')

        // Redirect based on role
        if (userData?.role === 'admin') {
            return NextResponse.redirect(new URL('/admin', request.url))
        } else {
            return NextResponse.redirect(new URL('/user/dashboard', request.url))
        }
    }

    // If user is not logged in and trying to access protected routes, redirect to login
    if (!token && isProtectedRoute) {
        console.log('[Middleware] Redirecting unauthenticated user to login')

        // Store the original URL to redirect back after login
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('callbackUrl', path)

        return NextResponse.redirect(loginUrl)
    }

    // If user is not admin but trying to access admin routes, redirect to user dashboard
    if (token && isAdminRoute && userData?.role !== 'admin') {
        console.log('[Middleware] Non-admin user trying to access admin route, redirecting to user dashboard')
        return NextResponse.redirect(new URL('/user/dashboard', request.url))
    }

    // Allow access to all other routes
    console.log('[Middleware] Allowing access to:', path)
    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon.ico|uploads|public).*)',
    ]
}