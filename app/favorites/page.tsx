// app/favorites/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_contexts/AuthContext";
import Link from "next/link";
import FavoriteCard, { FavoriteItemType } from "./_components/FavoriteCard";
import { getFavoritesAction, removeFromFavoritesAction } from "@/lib/actions/favorites-action";
import "./favorites.css";

export default function FavoritesPage() {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [items, setItems] = useState<FavoriteItemType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [removingId, setRemovingId] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated) { router.push("/login?redirect=/favorites"); return; }

        (async () => {
            setLoading(true);
            const result = await getFavoritesAction();
            if (result.success && result.favorites) {
                setItems(result.favorites.items ?? []);
            } else {
                setError(result.message || "Could not load favorites");
            }
            setLoading(false);
        })();
    }, [isAuthenticated, authLoading, router]);

    const handleRemove = async (refId: string) => {
        setRemovingId(refId);
        const result = await removeFromFavoritesAction(refId);
        if (result.success && result.favorites) {
            setItems(result.favorites.items ?? []);
        }
        setRemovingId(null);
    };

    // ── Loading ──
    if (authLoading || loading) {
        return (
            <div className="fav-loading">
                <div className="fav-loading-hearts">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="fav-loading-heart" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                </div>
                <p className="fav-loading-text">Gathering your favorites…</p>
            </div>
        );
    }

    // ── Error ──
    if (error) {
        return (
            <div className="fav-error">
                <div className="fav-error-icon">🥀</div>
                <h1 className="fav-error-title">Something went wrong</h1>
                <p className="fav-error-msg">{error}</p>
                <Link href="/shop" className="fav-error-cta">Back to Shop</Link>
            </div>
        );
    }

    return (
        <div className="fav-page">
            {/* Header */}
            <header className="fav-header">
                <div className="fav-header-inner">
                    <div>
                        <p className="fav-eyebrow">♡ Saved</p>
                        <h1 className="fav-title">My Favorites</h1>
                    </div>
                    <div className="fav-count-badge">
                        <span>{items.length}</span>
                        <span>{items.length === 1 ? "item" : "items"}</span>
                    </div>
                </div>
                <div className="fav-header-divider" />
            </header>

            {/* Body */}
            <div className="fav-body">
                {items.length === 0 ? (
                    <div className="fav-empty">
                        <div className="fav-empty-art">
                            <div className="fav-empty-ring" />
                            <div className="fav-empty-ring" />
                            <div className="fav-empty-ring" />
                            <span className="fav-empty-icon">🌷</span>
                        </div>
                        <h2 className="fav-empty-title">Nothing saved yet</h2>
                        <p className="fav-empty-sub">
                            When you find something you love, tap the heart.<br />
                            It'll live here, waiting for you.
                        </p>
                        <Link href="/shop" className="fav-empty-cta">
                            Explore Florals
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                    </div>
                ) : (
                    <div className="fav-grid">
                        {items.map((item, idx) => (
                            <FavoriteCard
                                key={item._id}
                                item={item}
                                index={idx}
                                onRemove={handleRemove}
                                isRemoving={removingId === item.refId}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}