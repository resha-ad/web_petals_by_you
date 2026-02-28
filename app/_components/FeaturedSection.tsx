"use client";

// app/_components/FeaturedSection.tsx
// Fetches featured items directly via fetch() with credentials:"include"
// The backend /api/items uses optionalProtect — works for guests AND logged-in users.

import { useState, useEffect } from "react";
import Link from "next/link";
import FeaturedItemCard from "./FeaturedItemCard";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

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

export default function FeaturedSection() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchFeatured() {
            try {
                // Try with credentials first (works when logged in and for optionalProtect endpoints)
                const res = await fetch(`${API_BASE}/api/items?limit=20`, {
                    credentials: "include",
                    signal: controller.signal,
                });

                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const data = await res.json();

                if (data.success && data.data?.items) {
                    const featured = (data.data.items as Item[]).filter((i) => i.isFeatured);
                    setItems(featured.slice(0, 3));
                } else {
                    setError(true);
                }
            } catch (err: any) {
                if (err.name === "AbortError") return;
                // Fallback: try without credentials (guest mode)
                try {
                    const res2 = await fetch(`${API_BASE}/api/items?limit=20`, {
                        credentials: "omit",
                    });
                    const data2 = await res2.json();
                    if (data2.success && data2.data?.items) {
                        const featured = (data2.data.items as Item[]).filter((i) => i.isFeatured);
                        setItems(featured.slice(0, 3));
                    } else {
                        setError(true);
                    }
                } catch {
                    setError(true);
                }
            } finally {
                setLoading(false);
            }
        }

        fetchFeatured();
        return () => controller.abort();
    }, []);

    return (
        <section className="py-24 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-14">
                <p className="text-xs tracking-widest uppercase text-[#C08080] mb-3">✦ Curated for You ✦</p>
                <h2 className="text-4xl md:text-5xl font-serif text-[#6B4E4E]" style={{ fontFamily: "Georgia, serif" }}>
                    Featured Bouquets
                </h2>
                <p className="text-[#9A7A7A] text-sm mt-3 max-w-sm mx-auto leading-relaxed">
                    Each arrangement is handpicked by our florists for its beauty and freshness.
                </p>
            </div>

            {loading ? (
                <div className="grid md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="rounded-3xl overflow-hidden bg-white shadow-sm animate-pulse">
                            <div className="h-72 bg-rose-100/60" />
                            <div className="p-5 space-y-3">
                                <div className="h-4 bg-rose-100 rounded w-3/4" />
                                <div className="h-3 bg-rose-50 rounded w-full" />
                                <div className="h-3 bg-rose-50 rounded w-2/3" />
                                <div className="flex justify-between items-center pt-2">
                                    <div className="h-6 bg-rose-100 rounded w-24" />
                                    <div className="w-10 h-10 rounded-full bg-rose-100" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : items.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <FeaturedItemCard key={item._id} item={item} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 text-[#9A7A7A]">
                    <div className="text-5xl mb-4">💐</div>
                    <p className="text-sm">
                        {error
                            ? "Could not load bouquets. Please check your connection."
                            : "No featured bouquets yet. Check back soon!"}
                    </p>
                </div>
            )}

            <div className="text-center mt-10">
                <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-sm text-[#9A7A7A] hover:text-[#6B4E4E] transition border-b border-dashed border-rose-200 pb-0.5"
                >
                    View all bouquets <span>→</span>
                </Link>
            </div>
        </section>
    );
}