// app/cart/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_contexts/AuthContext";
import Link from "next/link";
import CartItem from "./_components/CartItem";
import CartSummary from "./_components/CartSummary";
import EmptyCart from "./_components/EmptyCart";
import type { CheckoutFormData } from "./_components/CheckoutModal";

import {
    getUserCartAction,
    updateQuantityAction,
    removeItemAction,
    clearCartAction,
} from "@/lib/actions/cart-action";
import { placeOrderAction } from "@/lib/actions/order-action";

import "./cart.css";

export interface CartItemType {
    _id: string;
    type: "product" | "custom";
    refId: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    details?: {
        name?: string;
        images?: string[];
        description?: string;
        price?: number;
        stock?: number;
        flowers?: any[];
        wrapping?: any;
        note?: string;
        recipientName?: string;
        totalPrice?: number;
    };
}

function normalizeCartItems(rawItems: any[]): CartItemType[] {
    return rawItems.map((item: any, idx: number) => {
        let refId: string;
        let details: CartItemType["details"] | null = null;

        if (item.refDetails) {
            // New backend: refDetails attached directly ✅
            refId = String(item.refId);
            details = item.refDetails;
        } else if (item.refId && typeof item.refId === "object" && !Array.isArray(item.refId)) {
            // Old: populated refId object
            refId = (item.refId._id ?? item.refId.id ?? item.refId).toString();
            details = item.refId;
        } else {
            // Plain string ID
            refId = String(item.refId);
            details = item.details ?? null;
        }

        if (process.env.NODE_ENV === "development") {
            console.log(`[cart item ${idx}]`, { type: item.type, refId, name: details?.name, images: details?.images });
        }

        return {
            _id: item._id?.toString() ?? refId,
            type: item.type,
            refId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal,
            details: details ?? undefined,
        };
    });
}

export default function CartPage() {
    const { isAuthenticated, isLoading: authLoading, user } = useAuth();
    const router = useRouter();

    const [cart, setCart] = useState<{ items: CartItemType[]; total: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [isClearing, setIsClearing] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const applyCart = (raw: any) => {
        if (!raw) return;
        setCart({ total: raw.total ?? 0, items: normalizeCartItems(raw.items ?? []) });
    };

    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated) { router.push("/login?redirect=/cart"); return; }
        (async () => {
            setLoading(true);
            const result = await getUserCartAction();
            if (result.success && result.cart) applyCart(result.cart);
            else setError(result.message || "Cart unavailable");
            setLoading(false);
        })();
    }, [isAuthenticated, authLoading, router]);

    const handleUpdateQuantity = async (refId: string, newQty: number) => {
        if (newQty < 1) return;
        setUpdatingId(refId);
        const result = await updateQuantityAction(refId, newQty);
        if (result.success && result.cart) applyCart(result.cart);
        else alert(result.message || "Could not update quantity");
        setUpdatingId(null);
    };

    const handleRemoveItem = async (refId: string) => {
        if (!confirm("Remove this item?")) return;
        setUpdatingId(refId);
        const result = await removeItemAction(refId);
        if (result.success && result.cart) applyCart(result.cart);
        else alert(result.message || "Could not remove item");
        setUpdatingId(null);
    };

    const handleClearCart = async () => {
        if (!confirm("Remove all items from your cart?")) return;
        setIsClearing(true);
        const result = await clearCartAction();
        if (result.success && result.cart) applyCart(result.cart);
        else alert(result.message || "Could not clear cart");
        setIsClearing(false);
    };

    const handleCheckout = async (formData: CheckoutFormData) => {
        setIsCheckingOut(true);
        const result = await placeOrderAction(
            formData.paymentMethod,
            {
                recipientName: formData.recipientName,
                recipientPhone: formData.recipientPhone,
                email: formData.email,
                address: {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state || undefined,
                    zip: formData.zip || undefined,
                    country: formData.country,
                },
            },
            formData.notes || undefined
        );

        if (result.success) {
            // result.data = { order, delivery }
            router.push(`/user/orders/${result.data.order._id}?placed=1`);
        } else {
            alert(result.message || "Could not place order");
            setIsCheckingOut(false);
        }
    };

    if (authLoading || loading) return (
        <div className="cart-loading">
            <div className="loading-petals">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="loading-petal" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
            </div>
            <p className="loading-text">Gathering your blooms…</p>
        </div>
    );

    if (error) return (
        <div className="cart-error">
            <div className="error-icon">🥀</div>
            <h1 className="error-title">Something wilted</h1>
            <p className="error-message">{error}</p>
            <Link href="/shop" className="error-cta">Back to Shop</Link>
        </div>
    );

    if (!cart || cart.items.length === 0) return (
        <div className="cart-page-wrap"><EmptyCart /></div>
    );

    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="cart-page-wrap">
            <header className="cart-header">
                <div className="cart-header-inner">
                    <div className="cart-header-text">
                        <p className="cart-eyebrow">✦ Your Selection</p>
                        <h1 className="cart-title">Shopping Cart</h1>
                    </div>
                    <div className="cart-count-badge">
                        <span>{itemCount}</span>
                        <span>{itemCount === 1 ? "item" : "items"}</span>
                    </div>
                </div>
                <div className="cart-header-divider" />
            </header>

            <div className="cart-body">
                <section className="cart-items-section">
                    <div className="cart-items-list">
                        {cart.items.map((item, idx) => (
                            <div key={item._id} className="cart-item-wrapper" style={{ animationDelay: `${idx * 0.07}s` }}>
                                <CartItem
                                    item={item}
                                    onUpdateQuantity={handleUpdateQuantity}
                                    onRemove={handleRemoveItem}
                                    isUpdating={updatingId === item.refId}
                                />
                            </div>
                        ))}
                    </div>
                </section>

                <aside className="cart-sidebar">
                    <CartSummary
                        total={cart.total}
                        itemCount={itemCount}
                        onClearCart={handleClearCart}
                        isClearing={isClearing}
                        onCheckout={handleCheckout}
                        isCheckingOut={isCheckingOut}
                        user={user}
                    />
                </aside>
            </div>
        </div>
    );
}