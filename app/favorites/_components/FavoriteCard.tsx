// app/favorites/_components/FavoriteCard.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export interface FavoriteItemType {
    _id: string;
    type: "product" | "custom";
    refId: string;
    details?: {
        name?: string;
        images?: string[];
        price?: number;
        discountPrice?: number | null;
        slug?: string;
        description?: string;
    };
}

interface Props {
    item: FavoriteItemType;
    onRemove: (refId: string) => void;
    isRemoving?: boolean;
    index: number;
}

export default function FavoriteCard({ item, onRemove, isRemoving, index }: Props) {
    const [imgError, setImgError] = useState(false);

    const rawImage = item.details?.images?.[0];
    let imageSrc = "/images/placeholder-flower.jpg";
    if (!imgError && rawImage) {
        const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");
        const path = rawImage.startsWith("/") ? rawImage : `/${rawImage}`;
        imageSrc = rawImage.startsWith("http") ? rawImage : `${base}${path}`;
    }

    const name = item.type === "custom" ? "Bespoke Bouquet" : (item.details?.name ?? "Product");
    const price = item.details?.discountPrice ?? item.details?.price;
    const originalPrice = item.details?.discountPrice ? item.details.price : null;
    const slug = item.details?.slug;

    return (
        <div
            className={`fav-card ${isRemoving ? "opacity-40 pointer-events-none" : ""}`}
            style={{ animationDelay: `${index * 0.06}s` }}
        >
            {/* Image */}
            <div className="fav-card-img">
                {item.type === "custom" ? (
                    <div className="fav-custom-preview">💐</div>
                ) : (
                    <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={imageSrc}
                            alt={name}
                            onError={() => setImgError(true)}
                        />
                        <div className="fav-card-img-overlay" />
                    </>
                )}

                {/* Remove overlay button */}
                <button
                    className="fav-remove-btn"
                    onClick={() => onRemove(item.refId)}
                    aria-label="Remove from favorites"
                    type="button"
                >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
            </div>

            {/* Body */}
            <div className="fav-card-body">
                <p className="fav-card-type">
                    {item.type === "custom" ? "✦ Custom" : "✦ Signature"}
                </p>
                <h3 className="fav-card-name">{name}</h3>

                {price !== undefined && (
                    <p className="fav-card-price">
                        Rs. {price?.toLocaleString()}
                        {originalPrice && (
                            <span className="fav-card-price-original">
                                Rs. {originalPrice.toLocaleString()}
                            </span>
                        )}
                    </p>
                )}

                <div className="fav-card-cta">
                    {slug ? (
                        <Link href={`/shop/${slug}`} className="fav-card-view">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            View Item
                        </Link>
                    ) : (
                        <span className="fav-card-view" style={{ opacity: 0.4, cursor: "default" }}>
                            View Item
                        </span>
                    )}
                    <button
                        className="fav-card-remove"
                        onClick={() => onRemove(item.refId)}
                        type="button"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
}