// app/cart/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_contexts/AuthContext";
import Link from "next/link";
import CartItem from "./_components/CartItem";
import CartSummary from "./_components/CartSummary";
import EmptyCart from "./_components/EmptyCart";

import {
    getUserCartAction,
    updateQuantityAction,
    removeItemAction,
    clearCartAction,
} from "@/lib/actions/cart-action";

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
        flowers?: any[];
        wrapping?: any;
        note?: string;
        recipientName?: string;
        totalPrice?: number;
    };
}

function normalizeCartItems(rawItems: any[]): CartItemType[] {
    return rawItems.map((item: any, idx: number) => {
        // After JSON.parse(JSON.stringify(doc)), Mongoose docs become plain objects.
        // refId will be either:
        //   (a) a plain object with _id field → populated
        //   (b) a plain string ObjectId        → not populated
        const isPopulated = item.refId && typeof item.refId === "object" && !Array.isArray(item.refId);
        const refId = isPopulated
            ? (item.refId._id ?? item.refId.id ?? item.refId).toString()
            : String(item.refId);
        const details = isPopulated ? item.refId : (item.details ?? null);

        // Dev-only log to confirm image paths
        if (process.env.NODE_ENV === "development") {
            console.log(`[cart item ${idx}]`, {
                type: item.type,
                refId,
                isPopulated,
                images: details?.images,
                name: details?.name,
            });
        }

        return {
            _id: item._id?.toString() ?? refId,
            type: item.type,
            refId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal,
            details,
        };
    });
}

export default function CartPage() {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [cart, setCart] = useState<{ items: CartItemType[]; total: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [isClearing, setIsClearing] = useState(false);

    const applyCart = (raw: any) => {
        if (!raw) return;
        setCart({
            total: raw.total ?? 0,
            items: normalizeCartItems(raw.items ?? []),
        });
    };

    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated) {
            router.push("/login?redirect=/cart");
            return;
        }

        (async () => {
            setLoading(true);
            const result = await getUserCartAction();
            if (result.success && result.cart) {
                applyCart(result.cart);
            } else {
                setError(result.message || "Cart is empty or unavailable");
            }
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
        if (!confirm("Remove this item from your cart?")) return;
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

    if (authLoading || loading) {
        return (
            <div className="cart-loading">
                <div className="loading-petals">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="loading-petal" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                </div>
                <p className="loading-text">Gathering your blooms…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="cart-error">
                <div className="error-icon">🥀</div>
                <h1 className="error-title">Something wilted</h1>
                <p className="error-message">{error}</p>
                <Link href="/shop" className="error-cta">Back to Shop</Link>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="cart-page-wrap">
                <EmptyCart />
            </div>
        );
    }

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
                            <div
                                key={item._id}
                                className="cart-item-wrapper"
                                style={{ animationDelay: `${idx * 0.07}s` }}
                            >
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
                    />
                </aside>
            </div>
        </div>
    );
}