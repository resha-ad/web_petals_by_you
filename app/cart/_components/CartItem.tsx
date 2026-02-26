// app/cart/_components/CartItem.tsx
"use client";

import { useState } from "react";
import CustomBouquetPlaceholder from "./CustomBouquetPlaceholder";
import { CartItemType } from "../page";

interface CartItemProps {
    item: CartItemType;
    onUpdateQuantity: (refId: string, qty: number) => void;
    onRemove: (refId: string) => void;
    isUpdating?: boolean;
}

export default function CartItem({ item, onUpdateQuantity, onRemove, isUpdating }: CartItemProps) {
    const [imgError, setImgError] = useState(false);

    // ── Diagnostic: open browser console to see these ─────────────────
    console.log("[CartItem] details:", item.details);
    console.log("[CartItem] images:", item.details?.images);
    console.log("[CartItem] NEXT_PUBLIC_API_BASE_URL:", process.env.NEXT_PUBLIC_API_BASE_URL);

    // ── Build image URL ────────────────────────────────────────────────
    const rawImage = item.details?.images?.[0];
    let imageSrc = "/images/placeholder.jpg";

    if (!imgError && rawImage) {
        if (rawImage.startsWith("http")) {
            imageSrc = rawImage;
        } else {
            const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");
            const path = rawImage.startsWith("/") ? rawImage : `/${rawImage}`;
            imageSrc = `${base}${path}`;
        }
    }

    console.log("[CartItem] final imageSrc:", imageSrc, "| imgError:", imgError);

    return (
        <div className={`cart-item group ${isUpdating ? "opacity-60 pointer-events-none" : ""}`}>
            <div className="cart-item-image">
                {item.type === "custom" ? (
                    <CustomBouquetPlaceholder />
                ) : (
                    <div className="product-image-wrap">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={imageSrc}
                            alt={item.details?.name || "Product"}
                            onError={() => {
                                console.warn("[CartItem] ❌ Image 404 or failed:", imageSrc);
                                setImgError(true);
                            }}
                            onLoad={() => console.log("[CartItem] ✅ Image loaded:", imageSrc)}
                            style={{
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "inherit",
                            }}
                        />
                        <div className="image-overlay" />
                    </div>
                )}
            </div>

            <div className="cart-item-content">
                <div className="cart-item-header">
                    <div>
                        <span className="item-type-badge">
                            {item.type === "custom" ? "✦ Custom Creation" : "✦ Signature"}
                        </span>
                        <h3 className="item-name">
                            {item.type === "custom" ? "Bespoke Bouquet" : item.details?.name || "Product"}
                        </h3>
                        {item.type === "custom" && item.details && (
                            <div className="custom-details">
                                {item.details.flowers && item.details.flowers.length > 0 && (
                                    <p className="custom-detail-row">
                                        <span className="detail-icon">🌸</span>
                                        {item.details.flowers.map((f: any) => `${f.name} ×${f.count}`).join(" · ")}
                                    </p>
                                )}
                                {item.details.wrapping && (
                                    <p className="custom-detail-row">
                                        <span className="detail-icon">🎀</span>
                                        {item.details.wrapping.name}
                                    </p>
                                )}
                                {item.details.recipientName && (
                                    <p className="custom-detail-row">
                                        <span className="detail-icon">💌</span>
                                        For {item.details.recipientName}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                    <button onClick={() => onRemove(item.refId)} className="remove-btn" aria-label="Remove item" disabled={isUpdating}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <div className="cart-item-footer">
                    <div className="qty-control">
                        <button onClick={() => onUpdateQuantity(item.refId, item.quantity - 1)} disabled={item.quantity <= 1 || isUpdating} className="qty-btn" aria-label="Decrease">
                            <svg width="10" height="2" viewBox="0 0 10 2" fill="none"><path d="M1 1h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.refId, item.quantity + 1)} disabled={isUpdating} className="qty-btn" aria-label="Increase">
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                        </button>
                    </div>
                    <div className="item-pricing">
                        {item.quantity > 1 && <span className="unit-price">Rs. {item.unitPrice.toLocaleString()} each</span>}
                        <span className="subtotal-price">Rs. {item.subtotal.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}