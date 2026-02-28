"use client";

// app/user/dashboard/page.tsx
// ─── "My Garden" — the personalized user space ───────────────────────────────

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/app/_contexts/AuthContext";
import { getUserCartAction } from "@/lib/actions/cart-action";
import { getFavoritesAction } from "@/lib/actions/favorites-action";
import { handleGetAllItems } from "@/lib/actions/item-action";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Item = {
    _id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    discountPrice?: number | null;
    images: string[];
    isFeatured?: boolean;
    stock?: number;
};

type CartItem = {
    refId: string;
    type: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    details?: { name?: string; images?: string[] };
};

type FavItem = {
    _id: string;
    type: "product" | "custom";
    refId: string;
    details?: {
        name?: string;
        images?: string[];
        price?: number;
        discountPrice?: number | null;
        slug?: string;
    };
};

// ─── Inline SVG icons (zero emoji) ────────────────────────────────────────────

const Icons = {
    arrow: (
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
    ),
    arrowSmall: (
        <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
    ),
    heart: (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
    ),
    heartFill: (
        <svg width="16" height="16" fill="#E8B4B8" stroke="#C08080" strokeWidth="1.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
    ),
    cart: (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>
    ),
    scissors: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
            <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
            <path strokeLinecap="round" d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12" />
        </svg>
    ),
    sparkle: (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
        </svg>
    ),
    gift: (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0H8.25m3.75 0h3.75M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
        </svg>
    ),
    package: (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0-6.75H7.5m4.5 0h4.5M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
        </svg>
    ),
    user: (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
    ),
    leaf: (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 0 1 3-3 3 3 0 0 1 3 3v8.25a3 3 0 0 1-3 3Z" />
        </svg>
    ),
    eye: (
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
    ),
    star: (
        <svg width="11" height="11" fill="#F9A8D4" stroke="#E8B4B8" strokeWidth="0.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
    ),
};

// ─── Skeleton loader ───────────────────────────────────────────────────────────

function Shimmer({ className }: { className: string }) {
    return (
        <div
            className={`rounded-xl ${className}`}
            style={{
                background: "linear-gradient(90deg, #f3e8e8 25%, #f9f0f0 50%, #f3e8e8 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.6s infinite",
            }}
        />
    );
}

// ─── Section wrapper with fade-in ─────────────────────────────────────────────

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0.08 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1)",
            }}
        >
            {children}
        </div>
    );
}

// ─── Section heading ───────────────────────────────────────────────────────────

function Heading({
    eyebrow,
    title,
    href,
    hrefLabel,
}: {
    eyebrow: string;
    title: string;
    href?: string;
    hrefLabel?: string;
}) {
    return (
        <div className="flex items-end justify-between mb-7">
            <div>
                <p className="flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-[#C08080] mb-1.5 font-medium">
                    <span style={{ display: "inline-block", width: 20, height: 1, background: "#E8B4B8" }} />
                    {eyebrow}
                    <span style={{ display: "inline-block", width: 20, height: 1, background: "#E8B4B8" }} />
                </p>
                <h2
                    className="text-[1.6rem] text-[#3D2314] leading-snug"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                    {title}
                </h2>
            </div>
            {href && hrefLabel && (
                <Link
                    href={href}
                    className="flex items-center gap-1.5 text-xs text-[#B09090] hover:text-[#6B4E4E] transition-colors border-b border-dashed border-[#E8B4B8] pb-0.5 whitespace-nowrap"
                >
                    {hrefLabel}
                    <span className="text-[#C08080]">{Icons.arrowSmall}</span>
                </Link>
            )}
        </div>
    );
}

// ─── Image helper ──────────────────────────────────────────────────────────────

function resolveImg(raw?: string): string | null {
    if (!raw) return null;
    if (raw.startsWith("http")) return raw;
    const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");
    return `${base}${raw.startsWith("/") ? raw : `/${raw}`}`;
}

// ─── HERO BANNER ──────────────────────────────────────────────────────────────

function HeroBanner({ user }: { user: { username?: string } | null }) {
    const hour = new Date().getHours();
    const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    const first = user?.username?.split(/[\s._-]/)[0] ?? "there";
    const name = first.charAt(0).toUpperCase() + first.slice(1);

    return (
        <div
            className="relative overflow-hidden rounded-[2rem] mb-10"
            style={{
                background: "linear-gradient(135deg, #F3E6E6 0%, #EDCFCF 45%, #E4C4B8 100%)",
                minHeight: 220,
            }}
        >
            {/* Background rings */}
            {[380, 260, 160].map((s, i) => (
                <div
                    key={i}
                    className="absolute rounded-full border border-[#C08080]/10 pointer-events-none"
                    style={{ width: s, height: s, right: -s * 0.25, top: "50%", transform: "translateY(-50%)" }}
                />
            ))}

            {/* Decorative petal cluster */}
            <svg
                className="absolute right-0 top-0 h-full w-auto opacity-[0.08] pointer-events-none"
                viewBox="0 0 200 220"
                fill="none"
                preserveAspectRatio="xMaxYMid slice"
            >
                {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((deg) => (
                    <ellipse key={deg} cx="170" cy="110" rx="22" ry="52" fill="#6B4E4E" transform={`rotate(${deg} 170 110)`} />
                ))}
            </svg>

            <div className="relative z-10 px-8 md:px-12 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                    <p className="text-[10px] tracking-[0.25em] uppercase text-[#C08080] mb-2">{greet}</p>
                    <h1
                        className="text-[2.4rem] md:text-[3rem] text-[#3D2314] leading-none mb-3"
                        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                    >
                        Welcome back,
                        <br />
                        <span className="italic text-[#6B4E4E]">{name}</span>
                    </h1>
                    <p className="text-sm text-[#9A7A7A] max-w-xs leading-relaxed">
                        Your garden is in bloom. Pick up where you left off or discover something new.
                    </p>
                </div>
                <div className="flex flex-row md:flex-col gap-3 flex-shrink-0">
                    <Link
                        href="/shop"
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#6B4E4E] text-white text-sm tracking-wide hover:bg-[#5a3f3f] transition-all duration-300 shadow-lg shadow-rose-200/50 hover:shadow-xl hover:-translate-y-0.5 font-medium"
                    >
                        Shop Bouquets {Icons.arrow}
                    </Link>
                    <Link
                        href="/build"
                        className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#C08080]/40 text-[#6B4E4E] text-sm tracking-wide hover:bg-white/50 transition-all duration-300 backdrop-blur-sm"
                    >
                        {Icons.scissors} Build Bouquet
                    </Link>
                </div>
            </div>
        </div>
    );
}

// ─── QUICK LINKS ROW ──────────────────────────────────────────────────────────

function QuickLinks() {
    const links = [
        { href: "/user/orders", icon: Icons.package, label: "My Orders", sub: "Track deliveries" },
        { href: "/user/profile", icon: Icons.user, label: "Profile", sub: "Edit details" },
        { href: "/favorites", icon: Icons.heart, label: "Favourites", sub: "Saved items" },
        { href: "/shop", icon: Icons.gift, label: "Shop", sub: "Browse all" },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {links.map(({ href, icon, label, sub }, i) => (
                <Link
                    key={href}
                    href={href}
                    className="group p-4 rounded-2xl bg-white border border-rose-100 hover:border-[#E8B4B8] hover:shadow-lg hover:shadow-rose-100/60 hover:-translate-y-0.5 transition-all duration-300 flex flex-col gap-2.5"
                    style={{ animationDelay: `${i * 0.05}s` }}
                >
                    <div className="w-9 h-9 rounded-xl bg-[#FDF5F5] border border-rose-100 flex items-center justify-center text-[#C08080] group-hover:bg-[#F9EAEA] group-hover:text-[#6B4E4E] group-hover:scale-105 transition-all duration-300">
                        {icon}
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-[#6B4E4E]">{label}</p>
                        <p className="text-[10px] text-[#B09090] mt-0.5">{sub}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
}

// ─── CART SECTION ─────────────────────────────────────────────────────────────

function CartSection() {
    const [items, setItems] = useState<CartItem[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserCartAction().then((res) => {
            if (res.success && res.cart?.items) {
                const mapped = (res.cart.items as any[]).map((item) => ({
                    refId: item.refId ?? item._id,
                    type: item.type,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice ?? 0,
                    subtotal: item.subtotal ?? 0,
                    details: item.refDetails ?? item.details,
                }));
                setItems(mapped);
                setTotal(res.cart.total ?? 0);
            }
            setLoading(false);
        });
    }, []);

    const empty = !loading && items.length === 0;

    return (
        <div
            className="relative rounded-[1.75rem] overflow-hidden border border-rose-100/80"
            style={{
                background: "linear-gradient(145deg, #FFFFFF 0%, #FDF8F6 100%)",
                boxShadow: "0 4px 40px rgba(107,78,78,0.07)",
            }}
        >
            {/* Corner petal watermark */}
            <div className="absolute -right-6 -bottom-6 w-32 h-32 opacity-[0.04] pointer-events-none">
                <svg viewBox="0 0 100 100" fill="#6B4E4E">
                    {[0, 60, 120, 180, 240, 300].map((d) => (
                        <ellipse key={d} cx="50" cy="22" rx="14" ry="28" transform={`rotate(${d} 50 50)`} />
                    ))}
                </svg>
            </div>

            <div className="relative p-7">
                <Heading eyebrow="Waiting for you" title="Your Cart" href="/cart" hrefLabel="View full cart" />

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2].map((k) => (
                            <div key={k} className="flex gap-3">
                                <Shimmer className="w-14 h-14 flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <Shimmer className="h-3 w-3/4" />
                                    <Shimmer className="h-3 w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : empty ? (
                    /* ── Empty state ── */
                    <div className="py-8 flex flex-col items-center gap-4 text-center">
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center text-[#C08080]"
                            style={{ background: "linear-gradient(135deg, #FDF5F5 0%, #F9EAEA 100%)", border: "1.5px solid #F0D8D8" }}
                        >
                            {Icons.cart}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-[#6B4E4E]" style={{ fontFamily: "Georgia, serif" }}>
                                Your cart misses you
                            </p>
                            <p className="text-xs text-[#B09090] mt-1 max-w-[18ch] mx-auto leading-relaxed">
                                Your next favourite bouquet is just one click away.
                            </p>
                        </div>
                        <Link
                            href="/shop"
                            className="px-6 py-2.5 rounded-full bg-[#6B4E4E] text-white text-xs tracking-wide hover:bg-[#5a3f3f] transition-all duration-300 flex items-center gap-2"
                        >
                            Browse bouquets {Icons.arrowSmall}
                        </Link>
                    </div>
                ) : (
                    /* ── Items ── */
                    <div className="space-y-2.5">
                        {items.slice(0, 3).map((item) => {
                            const img = resolveImg(item.details?.images?.[0]);
                            return (
                                <div
                                    key={item.refId}
                                    className="flex items-center gap-3 p-3 rounded-2xl border border-rose-100/60 hover:border-[#E8C4C4] transition-colors"
                                    style={{ background: "rgba(253,248,246,0.6)" }}
                                >
                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-rose-50 flex-shrink-0 border border-rose-100">
                                        {img ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[#C08080]">{Icons.gift}</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-[#6B4E4E] truncate">
                                            {item.type === "custom" ? "Bespoke Bouquet" : item.details?.name ?? "Bouquet"}
                                        </p>
                                        <p className="text-[10px] text-[#B09090] mt-0.5">
                                            ×{item.quantity} &middot; Rs.&nbsp;{item.subtotal.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}

                        {items.length > 3 && (
                            <p className="text-[10px] text-[#B09090] text-center pt-0.5">
                                +{items.length - 3} more item{items.length - 3 !== 1 ? "s" : ""}
                            </p>
                        )}

                        <div
                            className="flex items-center justify-between pt-4 mt-1 border-t"
                            style={{ borderColor: "rgba(232,180,184,0.3)" }}
                        >
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-[#C08080]">Cart Total</p>
                                <p
                                    className="text-xl font-bold text-[#6B4E4E] mt-0.5"
                                    style={{ fontFamily: "Georgia, serif" }}
                                >
                                    Rs.&nbsp;{total.toLocaleString()}
                                </p>
                            </div>
                            <Link
                                href="/cart"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6B4E4E] text-white text-xs tracking-wide hover:bg-[#5a3f3f] transition-all duration-300 shadow-md shadow-rose-200/40 hover:-translate-y-0.5"
                            >
                                Checkout {Icons.arrow}
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── FAVOURITES SECTION ───────────────────────────────────────────────────────

function FavouritesSection() {
    const [items, setItems] = useState<FavItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getFavoritesAction().then((res) => {
            if (res.success && res.favorites?.items) setItems(res.favorites.items.slice(0, 4));
            setLoading(false);
        });
    }, []);

    const empty = !loading && items.length === 0;

    return (
        <div
            className="relative rounded-[1.75rem] overflow-hidden border border-rose-100/80"
            style={{
                background: "linear-gradient(145deg, #FDF8F6 0%, #FFFFFF 100%)",
                boxShadow: "0 4px 40px rgba(107,78,78,0.07)",
            }}
        >
            <div className="relative p-7">
                <Heading eyebrow="Your wishlist" title="Saved Favourites" href="/favorites" hrefLabel="View all" />

                {loading ? (
                    <div className="grid grid-cols-2 gap-3">
                        {[1, 2, 3, 4].map((k) => <Shimmer key={k} className="h-32 w-full" />)}
                    </div>
                ) : empty ? (
                    <div className="py-8 flex flex-col items-center gap-4 text-center">
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center text-[#C08080]"
                            style={{ background: "linear-gradient(135deg, #FDF5F5 0%, #F9EAEA 100%)", border: "1.5px solid #F0D8D8" }}
                        >
                            {Icons.heart}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-[#6B4E4E]" style={{ fontFamily: "Georgia, serif" }}>
                                Nothing saved yet
                            </p>
                            <p className="text-xs text-[#B09090] mt-1 max-w-[20ch] mx-auto leading-relaxed">
                                Heart a bouquet while browsing to save it here.
                            </p>
                        </div>
                        <Link
                            href="/shop"
                            className="px-6 py-2.5 rounded-full border border-[#E8B4B8] text-[#6B4E4E] text-xs tracking-wide hover:bg-rose-50 transition-all duration-300 flex items-center gap-2"
                        >
                            Discover bouquets {Icons.arrowSmall}
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {items.map((item) => {
                            const img = resolveImg(item.details?.images?.[0]);
                            const name = item.type === "custom" ? "Bespoke Bouquet" : (item.details?.name ?? "Bouquet");
                            const price = item.details?.discountPrice ?? item.details?.price;
                            const slug = item.details?.slug;

                            return (
                                <Link
                                    key={item._id}
                                    href={slug ? `/shop/${slug}` : "/shop"}
                                    className="group relative rounded-2xl overflow-hidden border border-rose-100 hover:border-[#E8B4B8] hover:shadow-lg hover:shadow-rose-100/60 hover:-translate-y-0.5 transition-all duration-400"
                                >
                                    <div className="aspect-square bg-[#F9EFED] overflow-hidden">
                                        {img ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[#C08080]">
                                                {Icons.heartFill}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-2.5">
                                        <p className="text-[11px] font-semibold text-[#6B4E4E] truncate leading-snug">{name}</p>
                                        {price !== undefined && (
                                            <p className="text-[10px] text-[#B09090] mt-0.5">Rs.&nbsp;{price.toLocaleString()}</p>
                                        )}
                                    </div>
                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/95 text-[#6B4E4E] text-[10px] font-medium">
                                            {Icons.eye} Quick view
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── BOUQUET BUILDER CTA ──────────────────────────────────────────────────────

function BuilderCTA() {
    return (
        <div
            className="relative rounded-[1.75rem] overflow-hidden"
            style={{ background: "linear-gradient(135deg, #5C3D3D 0%, #7A5050 40%, #9A6A58 100%)" }}
        >
            {/* Concentric rings */}
            {[500, 360, 240].map((s, i) => (
                <div
                    key={i}
                    className="absolute rounded-full border border-white/[0.06] pointer-events-none"
                    style={{ width: s, height: s, right: -s * 0.3, top: "50%", transform: "translateY(-50%)" }}
                />
            ))}

            {/* Large petal motif */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-[0.08] pointer-events-none">
                <svg width="200" height="200" viewBox="0 0 100 100" fill="white">
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((d) => (
                        <ellipse key={d} cx="50" cy="18" rx="10" ry="26" transform={`rotate(${d} 50 50)`} />
                    ))}
                </svg>
            </div>

            <div className="relative z-10 px-8 md:px-10 py-8 md:py-10">
                <div className="max-w-lg">
                    <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white">
                            {Icons.scissors}
                        </div>
                        <span className="text-[10px] tracking-[0.22em] uppercase text-rose-200/70">Exclusive Feature</span>
                    </div>
                    <h3
                        className="text-[2rem] md:text-[2.4rem] text-white leading-tight mb-3"
                        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                    >
                        Design Your
                        <br />
                        <span className="italic" style={{ color: "#F9D4C8" }}>Own Bouquet</span>
                    </h3>
                    <p className="text-sm text-rose-100/75 max-w-sm leading-relaxed mb-6">
                        Choose every bloom, pick your wrapping, write a personal note —
                        each petal placed by you, crafted by our florists.
                    </p>
                    <Link
                        href="/build"
                        className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-white text-[#6B4E4E] text-sm font-semibold tracking-wide hover:bg-rose-50 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 hover:-translate-y-0.5"
                    >
                        Start Building {Icons.arrow}
                    </Link>
                </div>
            </div>
        </div>
    );
}

// ─── FEATURED BOUQUETS ────────────────────────────────────────────────────────

function FeaturedGrid() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        handleGetAllItems(1, 20).then((res) => {
            if (res.success && res.data) {
                const featured = res.data.items.filter((i: Item) => i.isFeatured);
                setItems(featured.slice(0, 4));
            }
            setLoading(false);
        });
    }, []);

    return (
        <section>
            <Heading
                eyebrow="Curated for you"
                title="Featured Bouquets"
                href="/shop"
                hrefLabel="Shop all"
            />

            {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((k) => (
                        <div key={k} className="rounded-2xl overflow-hidden bg-white border border-rose-50 animate-pulse">
                            <Shimmer className="h-48 w-full rounded-none" />
                            <div className="p-4 space-y-2">
                                <Shimmer className="h-3 w-3/4" />
                                <Shimmer className="h-3 w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-14 rounded-[1.75rem] bg-white border border-rose-100 flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-[#C08080]">{Icons.leaf}</div>
                    <p className="text-sm text-[#B09090]">No featured bouquets right now — check back soon.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {items.map((item, idx) => {
                        const imgSrc = item.images?.[0]
                            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${item.images[0]}`
                            : "/images/placeholder-flower.jpg";
                        const price = item.discountPrice ?? item.price;

                        return (
                            <Link
                                key={item._id}
                                href={`/shop/${item.slug}`}
                                className="group bg-white rounded-2xl border border-rose-100 overflow-hidden hover:shadow-xl hover:shadow-rose-100/60 hover:-translate-y-1 transition-all duration-400"
                                style={{ animationDelay: `${idx * 0.07}s` }}
                            >
                                <div className="relative h-48 bg-[#F7EDEB] overflow-hidden">
                                    <Image
                                        src={imgSrc}
                                        alt={item.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-600"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                    {item.discountPrice && (
                                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-bold">
                                            {Math.round(((item.price - item.discountPrice) / item.price) * 100)}% OFF
                                        </span>
                                    )}
                                    {item.stock !== undefined && item.stock <= 5 && item.stock > 0 && (
                                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[9px]">
                                            Only {item.stock} left
                                        </span>
                                    )}
                                    <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-[#6B4E4E] text-[10px] font-medium">
                                            {Icons.eye} View
                                        </span>
                                    </div>
                                </div>
                                <div className="p-3.5">
                                    <div className="flex items-center gap-0.5 mb-1.5">
                                        {[1, 2, 3, 4, 5].map((s) => <span key={s}>{Icons.star}</span>)}
                                    </div>
                                    <h3
                                        className="text-[13px] font-semibold text-[#6B4E4E] line-clamp-1 group-hover:text-[#C08080] transition-colors mb-2"
                                        style={{ fontFamily: "Georgia, serif" }}
                                    >
                                        {item.name}
                                    </h3>
                                    <div className="flex items-baseline justify-between">
                                        <span className="text-sm font-bold text-[#6B4E4E]">Rs.&nbsp;{price.toLocaleString()}</span>
                                        {item.discountPrice && (
                                            <span className="text-[10px] text-gray-400 line-through">Rs.&nbsp;{item.price.toLocaleString()}</span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

// ─── OCCASION STRIP ───────────────────────────────────────────────────────────

function OccasionStrip() {
    const occasions = [
        { label: "Birthday", href: "/shop?occasion=birthday" },
        { label: "Anniversary", href: "/shop?occasion=anniversary" },
        { label: "Wedding", href: "/shop?occasion=wedding" },
        { label: "Just Because", href: "/shop" },
    ];

    return (
        <div
            className="rounded-[1.75rem] border border-rose-100 px-8 py-7 flex flex-col sm:flex-row items-center justify-between gap-5"
            style={{ background: "linear-gradient(135deg, #FFFFFF 0%, #FDF8F6 100%)" }}
        >
            <div>
                <p className="text-[10px] tracking-[0.22em] uppercase text-[#C08080] mb-1">Need inspiration?</p>
                <p
                    className="text-lg text-[#6B4E4E]"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                    Every occasion deserves flowers.
                </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                {occasions.map(({ label, href }) => (
                    <Link
                        key={label}
                        href={href}
                        className="px-4 py-2 rounded-full border border-rose-100 text-xs text-[#6B4E4E] hover:bg-rose-50 hover:border-[#E8B4B8] transition-all duration-200"
                    >
                        {label}
                    </Link>
                ))}
            </div>
        </div>
    );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function MyGardenPage() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FBF6F4] flex items-center justify-center flex-col gap-4">
                <div
                    className="w-9 h-9 rounded-full border-[3px] border-rose-100 border-t-[#6B4E4E]"
                    style={{ animation: "spin 0.8s linear infinite" }}
                />
                <p
                    className="text-[10px] tracking-[0.25em] uppercase text-[#C08080]"
                    style={{ fontFamily: "Georgia, serif" }}
                >
                    Tending your garden…
                </p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <>
            <main
                className="min-h-screen pt-24 pb-16"
                style={{ background: "linear-gradient(180deg, #FBF6F4 0%, #F7F0EE 100%)" }}
            >
                {/* Global shimmer keyframe */}
                <style>{`
                    @keyframes shimmer {
                        0%   { background-position: -200% 0; }
                        100% { background-position:  200% 0; }
                    }
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>

                <div className="max-w-6xl mx-auto px-5 md:px-8">

                    {/* ── Hero ── */}
                    <Section>
                        <HeroBanner user={user} />
                    </Section>

                    {/* ── Quick links ── */}
                    <Section>
                        <QuickLinks />
                    </Section>

                    {/* ── Cart + Favourites side by side ── */}
                    <Section>
                        <div className="grid md:grid-cols-2 gap-5 mb-10">
                            <CartSection />
                            <FavouritesSection />
                        </div>
                    </Section>

                    {/* ── Bouquet builder CTA ── */}
                    <Section className="mb-12">
                        <BuilderCTA />
                    </Section>

                    {/* ── Featured bouquets ── */}
                    <Section className="mb-10">
                        <FeaturedGrid />
                    </Section>

                    {/* ── Occasion inspiration strip ── */}
                    <Section>
                        <OccasionStrip />
                    </Section>
                </div>
            </main>
        </>
    );
}