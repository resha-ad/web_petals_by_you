// app/cart/_components/EmptyCart.tsx
"use client";

import Link from "next/link";

export default function EmptyCart() {
    return (
        <div className="empty-cart">
            <div className="empty-cart-art">
                <div className="empty-circle empty-circle-1" />
                <div className="empty-circle empty-circle-2" />
                <div className="empty-circle empty-circle-3" />
                <span className="empty-emoji">🌷</span>
            </div>
            <h1 className="empty-title">Your cart awaits</h1>
            <p className="empty-subtitle">
                Every beautiful arrangement begins with a single bloom.<br />
                Start your collection today.
            </p>
            <Link href="/shop" className="empty-cta">
                <span>Explore Our Florals</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </Link>
        </div>
    );
}