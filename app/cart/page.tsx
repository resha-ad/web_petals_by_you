"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";

interface CartItem {
    _id?: string;
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

export default function CartPage() {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [cart, setCart] = useState<{ items: CartItem[]; total: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated) {
            router.push("/login?redirect=/cart");
            return;
        }

        const fetchCart = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart`, {
                    credentials: "include",
                });

                if (!res.ok) throw new Error("Failed to load cart");

                const data = await res.json();
                if (data.success) {
                    setCart(data.data);
                } else {
                    setError(data.message || "Cart is empty or unavailable");
                }
            } catch (err: any) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [isAuthenticated, authLoading, router]);

    const handleUpdateQuantity = async (refId: string, newQty: number) => {
        if (newQty < 1) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/update-quantity`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ refId, quantity: newQty }),
            });

            if (!res.ok) throw new Error("Failed to update quantity");

            const data = await res.json();
            if (data.success) setCart(data.data);
        } catch (err) {
            alert("Could not update quantity");
        }
    };

    const handleRemoveItem = async (refId: string) => {
        if (!confirm("Remove this item?")) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/remove/${refId}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to remove item");

            const data = await res.json();
            if (data.success) setCart(data.data);
        } catch (err) {
            alert("Could not remove item");
        }
    };

    const handleClearCart = async () => {
        if (!confirm("Clear entire cart?")) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/clear`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to clear cart");

            const data = await res.json();
            if (data.success) setCart(data.data);
        } catch (err) {
            alert("Could not clear cart");
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6B4E4E]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
                <h1 className="text-3xl font-serif text-[#6B4E4E] mb-4">Your Cart</h1>
                <p className="text-[#9A7A7A] mb-6">{error}</p>
                <Link href="/shop" className="px-8 py-3 bg-[#6B4E4E] text-white rounded-full hover:bg-[#5a3f3f]">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
                <div className="text-6xl mb-6">🛒</div>
                <h1 className="text-3xl font-serif text-[#6B4E4E] mb-4">Your cart is empty</h1>
                <p className="text-[#9A7A7A] mb-8 max-w-md">
                    Looks like you haven't added anything yet. Start shopping to fill it up!
                </p>
                <Link href="/shop" className="px-8 py-3 bg-[#6B4E4E] text-white rounded-full hover:bg-[#5a3f3f]">
                    Browse Flowers
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FBF6F4] py-10 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-serif text-[#6B4E4E]">Your Cart</h1>
                    <button
                        onClick={handleClearCart}
                        className="text-sm text-rose-600 hover:text-rose-800 underline"
                    >
                        Clear Cart
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-rose-50 overflow-hidden">
                    {/* Items */}
                    {cart.items.map((item, index) => (
                        <div
                            key={item.refId}
                            className="flex flex-col sm:flex-row gap-6 p-6 border-b border-rose-50 last:border-b-0"
                        >
                            {/* Image / Preview */}
                            <div className="w-full sm:w-32 h-32 relative rounded-xl overflow-hidden flex-shrink-0">
                                {item.type === "custom" ? (
                                    // Simple bouquet preview placeholder
                                    <div className="w-full h-full bg-gradient-to-br from-rose-100 to-purple-100 flex items-center justify-center">
                                        <span className="text-4xl">💐</span>
                                    </div>
                                ) : (
                                    <Image
                                        src={
                                            item.details?.images?.[0]
                                                ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${item.details.images[0]}`
                                                : "/images/placeholder-flower.jpg"
                                        }
                                        alt={item.details?.name || "Product"}
                                        fill
                                        className="object-cover"
                                    />
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex-1">
                                <h3 className="font-serif text-xl text-[#6B4E4E] mb-2">
                                    {item.type === "custom"
                                        ? "Custom Bouquet"
                                        : item.details?.name || "Product"}
                                </h3>

                                {item.type === "custom" && item.details && (
                                    <div className="text-sm text-[#9A7A7A] mb-3">
                                        <p>
                                            {item.details.flowers
                                                ?.map((f: any) => `${f.name} × ${f.count}`)
                                                .join(", ")}
                                        </p>
                                        {item.details.wrapping && <p>Wrapped in {item.details.wrapping.name}</p>}
                                        {item.details.recipientName && <p>To: {item.details.recipientName}</p>}
                                    </div>
                                )}

                                <div className="flex items-center justify-between sm:justify-start gap-6">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleUpdateQuantity(item.refId, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                            className="w-8 h-8 rounded-full border border-rose-200 flex items-center justify-center text-[#6B4E4E] disabled:opacity-40"
                                        >
                                            −
                                        </button>
                                        <span className="w-10 text-center font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => handleUpdateQuantity(item.refId, item.quantity + 1)}
                                            className="w-8 h-8 rounded-full border border-rose-200 flex items-center justify-center text-[#6B4E4E]"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="text-right sm:text-left">
                                        <p className="text-lg font-semibold text-[#6B4E4E]">
                                            Rs. {item.subtotal.toLocaleString()}
                                        </p>
                                        <p className="text-sm text-[#9A7A7A]">
                                            Rs. {item.unitPrice.toLocaleString()} × {item.quantity}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Remove */}
                            <button
                                onClick={() => handleRemoveItem(item.refId)}
                                className="self-start text-rose-600 hover:text-rose-800 text-sm mt-2 sm:mt-0"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                {/* Summary & Checkout */}
                <div className="mt-8 bg-white rounded-2xl shadow-sm border border-rose-50 p-8">
                    <div className="flex justify-between items-center mb-6 pb-6 border-b border-rose-100">
                        <span className="text-xl font-serif text-[#6B4E4E]">Total</span>
                        <span className="text-2xl font-bold text-[#6B4E4E]">
                            Rs. {cart.total.toLocaleString()}
                        </span>
                    </div>

                    <button className="w-full py-4 bg-[#6B4E4E] text-white rounded-full text-lg font-medium hover:bg-[#5a3f3f] transition">
                        Proceed to Checkout
                    </button>

                    <p className="text-center text-sm text-[#9A7A7A] mt-4">
                        or <Link href="/shop" className="text-[#6B4E4E] underline">continue shopping</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}