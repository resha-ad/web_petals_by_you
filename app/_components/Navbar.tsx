"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/_contexts/AuthContext";
import { getUserCartAction } from "@/lib/actions/cart-action";
import NotificationBell from "./NotificationBell";

const publicLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/build", label: "Design Bouquet" },
];

function IconHeart() {
    return (
        <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
    );
}

function IconCart() {
    return (
        <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>
    );
}

function IconUser() {
    return (
        <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
    );
}

function IconGarden() {
    return (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 0 1 3-3 3 3 0 0 1 3 3v8.25a3 3 0 0 1-3 3Z" />
        </svg>
    );
}

function IconLogout() {
    return (
        <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
        </svg>
    );
}

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [lastY, setLastY] = useState(0);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [loggingOut, setLoggingOut] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuth();

    // Scroll: background on scroll, hide on scroll-down (auto-hide behavior)
    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY;
            setScrolled(y > 20);
            // Hide navbar when scrolling down past 80px, show when scrolling up
            if (y > 80) {
                setHidden(y > lastY + 5);
            } else {
                setHidden(false);
            }
            setLastY(y);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [lastY]);

    useEffect(() => { setMobileOpen(false); }, [pathname]);

    useEffect(() => {
        if (!isAuthenticated) { setCartCount(0); return; }
        getUserCartAction().then((res) => {
            if (res.success && res.cart?.items) {
                const n = (res.cart.items as any[]).reduce(
                    (sum: number, item: any) => sum + (Number(item.quantity) || 1),
                    0
                );
                setCartCount(n);
            }
        }).catch(() => { });
    }, [isAuthenticated, pathname]);

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    // ── Fixed logout: clear cookie via API route, then hard reload ────────────
    const handleLogout = useCallback(async () => {
        if (loggingOut) return;
        setLoggingOut(true);
        setMobileOpen(false);
        try {
            // Call our Next.js API route to delete httpOnly cookies server-side
            await fetch("/api/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch { /* still proceed */ }
        // Update context state
        await logout();
        // Hard navigate to ensure clean state (router.push keeps stale context)
        window.location.href = "/login";
    }, [logout, loggingOut]);

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${hidden ? "-translate-y-full" : "translate-y-0"
                    } ${scrolled
                        ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-rose-100/60"
                        : "bg-transparent"
                    }`}
                style={{ boxShadow: scrolled ? "0 2px 20px rgba(107,78,78,0.08)" : "none" }}
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
                            <div className="relative">
                                <div className="absolute inset-0 rounded-full bg-rose-100 scale-0 group-hover:scale-100 transition-transform duration-300" />
                                <Image
                                    src="/images/logo1.png"
                                    alt="Petals By You"
                                    width={52}
                                    height={52}
                                    className="object-contain relative z-10"
                                />
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-xl text-[#6B4E4E] tracking-widest" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                                    PETALS
                                </span>
                                <span className="text-[10px] tracking-[0.3em] text-[#C08080] uppercase -mt-0.5">by you</span>
                            </div>
                        </Link>

                        {/* Desktop nav links */}
                        <div className="hidden md:flex items-center gap-1">
                            {publicLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`relative px-4 py-2 text-sm tracking-wide transition-colors duration-200 group ${isActive(link.href) ? "text-[#6B4E4E]" : "text-[#9A7A7A] hover:text-[#6B4E4E]"
                                        }`}
                                >
                                    {link.label}
                                    <span
                                        className={`absolute bottom-0 left-4 right-4 h-px bg-[#E8B4B8] transition-transform duration-300 origin-center ${isActive(link.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                            }`}
                                    />
                                </Link>
                            ))}
                            {isAuthenticated && (
                                <Link
                                    href="/user/dashboard"
                                    className={`relative px-4 py-2 text-sm tracking-wide transition-colors duration-200 group flex items-center gap-1.5 ${isActive("/user/dashboard") ? "text-[#6B4E4E]" : "text-[#9A7A7A] hover:text-[#6B4E4E]"
                                        }`}
                                >
                                    <IconGarden />
                                    My Garden
                                    <span
                                        className={`absolute bottom-0 left-4 right-4 h-px bg-[#E8B4B8] transition-transform duration-300 origin-center ${isActive("/user/dashboard") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                            }`}
                                    />
                                </Link>
                            )}
                        </div>

                        {/* Right icons */}
                        <div className="flex items-center gap-0.5">
                            {/* Favorites */}
                            <Link
                                href="/favorites"
                                aria-label="Favourites"
                                className={`hidden sm:flex p-2.5 rounded-full transition-all duration-200 ${isActive("/favorites") ? "text-[#6B4E4E] bg-rose-50" : "text-[#9A7A7A] hover:text-[#6B4E4E] hover:bg-rose-50"
                                    }`}
                            >
                                <IconHeart />
                            </Link>

                            {/* Cart */}
                            <Link
                                href="/cart"
                                aria-label="Cart"
                                className={`relative flex p-2.5 rounded-full transition-all duration-200 ${isActive("/cart") ? "text-[#6B4E4E] bg-rose-50" : "text-[#9A7A7A] hover:text-[#6B4E4E] hover:bg-rose-50"
                                    }`}
                            >
                                <IconCart />
                                {cartCount > 0 && (
                                    <span
                                        key={cartCount}
                                        className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-0.5 rounded-full bg-[#E8B4B8] text-white text-[9px] font-bold flex items-center justify-center"
                                        style={{ animation: "badgePop 0.25s cubic-bezier(0.34,1.56,0.64,1) both" }}
                                    >
                                        {cartCount > 99 ? "99+" : cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Notification bell — authenticated only */}
                            <NotificationBell />

                            {/* Profile */}
                            {isAuthenticated && (
                                <Link
                                    href="/user/profile"
                                    aria-label="Profile"
                                    className={`hidden sm:flex p-2.5 rounded-full transition-all duration-200 ${isActive("/user/profile") ? "text-[#6B4E4E] bg-rose-50" : "text-[#9A7A7A] hover:text-[#6B4E4E] hover:bg-rose-50"
                                        }`}
                                >
                                    <IconUser />
                                </Link>
                            )}

                            {/* Divider */}
                            <div className="hidden md:block w-px h-5 bg-rose-200 mx-2" />

                            {/* Auth area */}
                            <div className="hidden md:flex items-center gap-2">
                                {isAuthenticated ? (
                                    <>
                                        <span className="px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-xs text-[#6B4E4E] font-medium max-w-[110px] truncate">
                                            {user?.username ?? "Account"}
                                        </span>
                                        <button
                                            onClick={handleLogout}
                                            disabled={loggingOut}
                                            aria-label="Log out"
                                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm text-[#9A7A7A] hover:text-red-500 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
                                        >
                                            <IconLogout />
                                            <span className="hidden lg:inline text-[13px]">
                                                {loggingOut ? "Logging out…" : "Log out"}
                                            </span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" className="px-4 py-2 text-sm text-[#9A7A7A] hover:text-[#6B4E4E] transition-colors tracking-wide">
                                            Login
                                        </Link>
                                        <Link href="/register" className="px-5 py-2 rounded-full bg-[#6B4E4E] text-white text-sm tracking-wide hover:bg-[#5a3f3f] transition-all duration-300 hover:shadow-md hover:shadow-rose-200/50">
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>

                            {/* Mobile hamburger */}
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                aria-label="Toggle menu"
                                className="md:hidden p-2.5 rounded-full text-[#6B4E4E] hover:bg-rose-50 transition ml-1"
                            >
                                <div className="w-5 h-4 flex flex-col justify-between">
                                    <span className={`block h-px bg-current transition-all duration-300 origin-center ${mobileOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
                                    <span className={`block h-px bg-current transition-all duration-300 ${mobileOpen ? "opacity-0 scale-x-0" : ""}`} />
                                    <span className={`block h-px bg-current transition-all duration-300 origin-center ${mobileOpen ? "-rotate-45 -translate-y-[9px]" : ""}`} />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={`md:hidden overflow-hidden transition-all duration-400 ${mobileOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="bg-white/98 backdrop-blur-md border-t border-rose-100 px-6 py-6 flex flex-col gap-0.5">
                        {publicLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`py-3 text-sm tracking-wide border-b border-rose-50 transition-colors ${isActive(link.href) ? "text-[#6B4E4E] font-medium" : "text-[#9A7A7A]"}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {isAuthenticated && (
                            <Link
                                href="/user/dashboard"
                                className={`py-3 text-sm tracking-wide border-b border-rose-50 transition-colors flex items-center gap-2 ${isActive("/user/dashboard") ? "text-[#6B4E4E] font-medium" : "text-[#9A7A7A]"}`}
                            >
                                <IconGarden /> My Garden
                            </Link>
                        )}
                        <div className="flex gap-3 mt-5">
                            {isAuthenticated ? (
                                <button
                                    onClick={handleLogout}
                                    disabled={loggingOut}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full border border-red-200 text-red-500 text-sm hover:bg-red-50 transition disabled:opacity-50"
                                >
                                    <IconLogout />
                                    {loggingOut ? "Logging out…" : "Log out"}
                                </button>
                            ) : (
                                <>
                                    <Link href="/login" className="flex-1 py-3 rounded-full border border-rose-200 text-[#6B4E4E] text-sm text-center hover:bg-rose-50 transition">
                                        Login
                                    </Link>
                                    <Link href="/register" className="flex-1 py-3 rounded-full bg-[#6B4E4E] text-white text-sm text-center hover:bg-[#5a3f3f] transition">
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <style jsx global>{`
                @keyframes badgePop {
                    0%   { transform: scale(0.5); opacity: 0; }
                    60%  { transform: scale(1.25); }
                    100% { transform: scale(1);   opacity: 1; }
                }
            `}</style>
        </>
    );
}