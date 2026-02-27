"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/build", label: "Design Bouquet" }
];

const iconLinks = [
    {
        href: "/favorites",
        label: "Favorites",
        icon: (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
        ),
    },
    {
        href: "/cart",
        label: "Cart",
        icon: (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
        ),
        badge: 3, // Replace with dynamic cart count
    },
    {
        href: "user/profile",
        label: "Profile",
        icon: (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
        ),
    },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? "bg-white/95 backdrop-blur-md shadow-sm shadow-rose-100/80 border-b border-rose-100/60"
                    : "bg-transparent"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between h-20">

                        {/* ── Logo ── */}
                        <Link href="/" className="flex items-center gap-3 group">
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
                                <span
                                    className="text-xl font-serif text-[#6B4E4E] tracking-widest"
                                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                                >
                                    PETALS
                                </span>
                                <span className="text-[10px] tracking-[0.3em] text-[#C08080] uppercase -mt-0.5">
                                    by you
                                </span>
                            </div>
                        </Link>

                        {/* ── Desktop Nav Links ── */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`relative px-4 py-2 text-sm tracking-wide transition-colors duration-200 group ${isActive(link.href)
                                        ? "text-[#6B4E4E]"
                                        : "text-[#9A7A7A] hover:text-[#6B4E4E]"
                                        }`}
                                >
                                    {link.label}
                                    <span
                                        className={`absolute bottom-0 left-4 right-4 h-px bg-[#E8B4B8] transition-transform duration-300 origin-center ${isActive(link.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                            }`}
                                    />
                                </Link>
                            ))}
                        </div>

                        {/* ── Right: Icons + CTA ── */}
                        <div className="flex items-center gap-1">
                            {/* Icon Links — hidden on mobile except cart */}
                            <div className="flex items-center">
                                {iconLinks.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        aria-label={item.label}
                                        className={`relative p-2.5 rounded-full transition-all duration-200 group ${isActive(item.href)
                                            ? "text-[#6B4E4E] bg-rose-50"
                                            : "text-[#9A7A7A] hover:text-[#6B4E4E] hover:bg-rose-50"
                                            } ${item.label === "Favorites" ? "hidden sm:flex" : "flex"}`}
                                    >
                                        {item.icon}
                                        {item.badge ? (
                                            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#E8B4B8] text-white text-[9px] font-bold flex items-center justify-center">
                                                {item.badge}
                                            </span>
                                        ) : null}
                                    </Link>
                                ))}
                            </div>

                            {/* Divider */}
                            <div className="hidden md:block w-px h-5 bg-rose-200 mx-2" />

                            {/* Auth CTA */}
                            <div className="hidden md:flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-sm text-[#9A7A7A] hover:text-[#6B4E4E] transition-colors tracking-wide"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-5 py-2 rounded-full bg-[#6B4E4E] text-white text-sm tracking-wide hover:bg-[#5a3f3f] transition-all duration-300 hover:shadow-md hover:shadow-rose-200/50"
                                >
                                    Sign Up
                                </Link>
                            </div>

                            {/* Mobile Hamburger */}
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                aria-label="Toggle menu"
                                className="md:hidden p-2.5 rounded-full text-[#6B4E4E] hover:bg-rose-50 transition ml-1"
                            >
                                <div className="w-5 h-4 flex flex-col justify-between">
                                    <span
                                        className={`block h-px bg-current transition-all duration-300 origin-center ${mobileOpen ? "rotate-45 translate-y-[7px]" : ""
                                            }`}
                                    />
                                    <span
                                        className={`block h-px bg-current transition-all duration-300 ${mobileOpen ? "opacity-0 scale-x-0" : ""
                                            }`}
                                    />
                                    <span
                                        className={`block h-px bg-current transition-all duration-300 origin-center ${mobileOpen ? "-rotate-45 -translate-y-[9px]" : ""
                                            }`}
                                    />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Mobile Menu ── */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-400 ${mobileOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
                        }`}
                >
                    <div className="bg-white/98 backdrop-blur-md border-t border-rose-100 px-6 py-6 flex flex-col gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`py-3 text-sm tracking-wide border-b border-rose-50 last:border-0 transition-colors ${isActive(link.href)
                                    ? "text-[#6B4E4E] font-medium"
                                    : "text-[#9A7A7A]"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="flex gap-3 mt-4">
                            <Link
                                href="/login"
                                className="flex-1 py-3 rounded-full border border-rose-200 text-[#6B4E4E] text-sm text-center hover:bg-rose-50 transition"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="flex-1 py-3 rounded-full bg-[#6B4E4E] text-white text-sm text-center hover:bg-[#5a3f3f] transition"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}