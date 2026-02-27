// app/_components/FavoritesButton.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_contexts/AuthContext";
import { addToFavoritesAction, removeFromFavoritesAction, checkIsFavoritedAction } from "@/lib/actions/favorites-action";

type Props = {
    itemId: string;
    isOutOfStock?: boolean;
};

type ToastState = "hidden" | "added" | "removed";

export default function FavoritesButton({ itemId, isOutOfStock = false }: Props) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [isFavorited, setIsFavorited] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState<ToastState>("hidden");

    // Check initial favorited state
    useEffect(() => {
        if (!isAuthenticated) { setIsLoading(false); return; }
        checkIsFavoritedAction(itemId).then((result) => {
            setIsFavorited(result);
            setIsLoading(false);
        });
    }, [isAuthenticated, itemId]);

    const showToast = useCallback((type: "added" | "removed") => {
        setToast(type);
        setTimeout(() => setToast("hidden"), 2800);
    }, []);

    const handleClick = async () => {
        if (!isAuthenticated) {
            router.push("/login?redirect=" + window.location.pathname);
            return;
        }
        if (isLoading) return;

        setIsLoading(true);
        if (isFavorited) {
            const result = await removeFromFavoritesAction(itemId);
            if (result.success !== false) {
                setIsFavorited(false);
                showToast("removed");
            }
        } else {
            const result = await addToFavoritesAction("product", itemId);
            if (result.success !== false) {
                setIsFavorited(true);
                showToast("added");
            }
        }
        setIsLoading(false);
    };

    return (
        <>
            <button
                type="button"
                onClick={handleClick}
                disabled={isOutOfStock || isLoading}
                title={isFavorited ? "Remove from Favorites" : "Save to Favorites"}
                className={`fav-btn ${isFavorited ? "fav-btn--active" : ""} ${isOutOfStock ? "fav-btn--disabled" : ""}`}
            >
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill={isFavorited ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className={`fav-icon ${isFavorited ? "fav-icon--filled" : ""}`}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                </svg>
            </button>

            {/* Toast notification */}
            <div className={`fav-toast ${toast !== "hidden" ? "fav-toast--visible" : ""} ${toast === "removed" ? "fav-toast--removed" : ""}`}>
                {toast === "added" && (
                    <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                        Saved to Favorites
                    </>
                )}
                {toast === "removed" && (
                    <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Removed from Favorites
                    </>
                )}
            </div>

            <style jsx>{`
                .fav-btn {
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 46px;
                    height: 46px;
                    border-radius: 50%;
                    border: 1.5px solid #E8C4C4;
                    background: white;
                    color: #C4878A;
                    cursor: pointer;
                    transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                }
                .fav-btn:hover:not(:disabled) {
                    background: #FDF0F0;
                    border-color: #D4A0A0;
                    transform: scale(1.08);
                }
                .fav-btn:active:not(:disabled) {
                    transform: scale(0.95);
                }
                .fav-btn--active {
                    background: #FEF0F0;
                    border-color: #E8A0A8;
                    color: #D4526A;
                }
                .fav-btn--active:hover:not(:disabled) {
                    background: #FDE0E4;
                    border-color: #C8607A;
                }
                .fav-btn--disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                    border-color: #E0D8D0;
                    color: #C0B0A8;
                }

                .fav-icon {
                    transition: all 0.2s ease;
                }
                .fav-icon--filled {
                    filter: drop-shadow(0 1px 3px rgba(212, 82, 106, 0.4));
                    animation: heartPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                @keyframes heartPop {
                    0%   { transform: scale(0.7); }
                    60%  { transform: scale(1.25); }
                    100% { transform: scale(1); }
                }

                /* Toast */
                .fav-toast {
                    position: fixed;
                    bottom: 32px;
                    left: 50%;
                    transform: translateX(-50%) translateY(20px);
                    background: #3D2314;
                    color: white;
                    font-size: 0.85rem;
                    font-weight: 500;
                    font-family: 'DM Sans', system-ui, sans-serif;
                    padding: 12px 20px;
                    border-radius: 100px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    opacity: 0;
                    pointer-events: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    z-index: 9999;
                    white-space: nowrap;
                    box-shadow: 0 8px 32px rgba(61, 35, 20, 0.25);
                }
                .fav-toast--visible {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
                .fav-toast--removed {
                    background: #6B6B6B;
                }
            `}</style>
        </>
    );
}