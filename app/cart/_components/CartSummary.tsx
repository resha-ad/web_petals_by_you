// app/cart/_components/CartSummary.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import CheckoutModal, { type CheckoutFormData } from "./CheckoutModal";

interface CartSummaryProps {
    total: number;
    itemCount: number;
    onClearCart: () => void;
    isClearing?: boolean;
    onCheckout: (data: CheckoutFormData) => void;
    isCheckingOut?: boolean;
    user?: { firstName?: string; lastName?: string; email?: string } | null;
}

export default function CartSummary({
    total,
    itemCount,
    onClearCart,
    isClearing,
    onCheckout,
    isCheckingOut,
    user,
}: CartSummaryProps) {
    const shipping = total >= 5000 ? 0 : 250;
    const grandTotal = total + shipping;
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className="summary-card">
                <div className="summary-header">
                    <h2 className="summary-title">Order Summary</h2>
                    <div className="summary-divider" />
                </div>

                <div className="summary-lines">
                    <div className="summary-line">
                        <span className="summary-label">
                            Subtotal{" "}
                            <span className="item-count">
                                ({itemCount} {itemCount === 1 ? "item" : "items"})
                            </span>
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

                <button
                    className="checkout-btn"
                    onClick={() => setShowModal(true)}
                    disabled={isCheckingOut}
                    style={{ opacity: isCheckingOut ? 0.7 : 1, cursor: isCheckingOut ? "not-allowed" : "pointer" }}
                >
                    {isCheckingOut ? (
                        <span>Placing Order…</span>
                    ) : (
                        <>
                            <span>Proceed to Checkout</span>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </>
                    )}
                </button>

                <Link href="/shop" className="continue-link">← Continue Shopping</Link>

                <div className="trust-badges">
                    <div className="trust-badge">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                        <span>Secure Checkout</span>
                    </div>
                    <div className="trust-badge">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                        </svg>
                        <span>Quality Guaranteed</span>
                    </div>
                    <div className="trust-badge">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                        </svg>
                        <span>Fast Delivery</span>
                    </div>
                </div>

                <button onClick={onClearCart} disabled={isClearing} className="clear-cart-link">
                    {isClearing ? "Clearing..." : "Clear all items"}
                </button>
            </div>

            {showModal && (
                <CheckoutModal
                    user={user ?? null}
                    grandTotal={grandTotal}
                    onConfirm={(data) => {
                        setShowModal(false);
                        onCheckout(data);
                    }}
                    onClose={() => setShowModal(false)}
                    isSubmitting={isCheckingOut ?? false}
                />
            )}
        </>
    );
}