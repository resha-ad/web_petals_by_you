// app/cart/_components/CartSummary.tsx
"use client";

import Link from "next/link";

interface CartSummaryProps {
    total: number;
    itemCount: number;
    onClearCart: () => void;
    isClearing?: boolean;
}

export default function CartSummary({ total, itemCount, onClearCart, isClearing }: CartSummaryProps) {
    const shipping = total >= 5000 ? 0 : 250;
    const grandTotal = total + shipping;

    return (
        <div className="summary-card">
            <div className="summary-header">
                <h2 className="summary-title">Order Summary</h2>
                <div className="summary-divider" />
            </div>

            <div className="summary-lines">
                <div className="summary-line">
                    <span className="summary-label">
                        Subtotal <span className="item-count">({itemCount} {itemCount === 1 ? "item" : "items"})</span>
                    </span>
                    <span className="summary-value">Rs. {total.toLocaleString()}</span>
                </div>
                <div className="summary-line">
                    <span className="summary-label">Delivery</span>
                    <span className={`summary-value ${shipping === 0 ? "free-badge" : ""}`}>
                        {shipping === 0 ? "Free" : `Rs. ${shipping}`}
                    </span>
                </div>
                {shipping > 0 && (
                    <div className="free-shipping-hint">
                        <span>✦</span>
                        Add Rs. {(5000 - total).toLocaleString()} more for free delivery
                    </div>
                )}
            </div>

            <div className="summary-total-row">
                <span className="total-label">Total</span>
                <span className="total-amount">Rs. {grandTotal.toLocaleString()}</span>
            </div>

            <button className="checkout-btn">
                <span>Proceed to Checkout</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            <Link href="/shop" className="continue-link">
                ← Continue Shopping
            </Link>

            <div className="trust-badges">
                <div className="trust-badge">
                    <span>🔒</span>
                    <span>Secure Checkout</span>
                </div>
                <div className="trust-badge">
                    <span>🌸</span>
                    <span>Fresh Guarantee</span>
                </div>
                <div className="trust-badge">
                    <span>🚚</span>
                    <span>Same-Day Delivery</span>
                </div>
            </div>

            <button
                onClick={onClearCart}
                disabled={isClearing}
                className="clear-cart-link"
            >
                {isClearing ? "Clearing..." : "Clear all items"}
            </button>
        </div>
    );
}