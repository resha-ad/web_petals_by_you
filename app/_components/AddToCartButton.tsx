// app/_components/AddToCartButton.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_contexts/AuthContext";
import { addToCartAction, getUserCartAction } from "@/lib/actions/cart-action";

type Props = {
    itemId: string;
    isOutOfStock: boolean;
};

type State = "checking" | "idle" | "in-cart" | "loading" | "error";

export default function AddToCartButton({ itemId, isOutOfStock }: Props) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [state, setState] = useState<State>("checking");
    const [quantity, setQuantity] = useState(1);

    // Check on mount whether this item is already in the cart
    useEffect(() => {
        if (!isAuthenticated) {
            setState("idle");
            return;
        }
        (async () => {
            try {
                const result = await getUserCartAction();
                if (result.success && result.cart?.items) {
                    const items = result.cart.items as any[];
                    // refId may be populated object or plain string
                    const inCart = items.some((item: any) => {
                        const id = item.refId?._id?.toString() ?? item.refId?.toString();
                        return id === itemId;
                    });
                    setState(inCart ? "in-cart" : "idle");
                } else {
                    setState("idle");
                }
            } catch {
                setState("idle");
            }
        })();
    }, [isAuthenticated, itemId]);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            router.push("/login?redirect=" + window.location.pathname);
            return;
        }
        setState("loading");
        try {
            const result = await addToCartAction(itemId, quantity);
            if (result && result.success !== false) {
                setState("in-cart");
            } else {
                setState("error");
                setTimeout(() => setState("idle"), 3000);
            }
        } catch {
            setState("error");
            setTimeout(() => setState("idle"), 3000);
        }
    };

    if (isOutOfStock) {
        return (
            <button disabled className="atc-btn atc-disabled" type="button">
                Out of Stock
            </button>
        );
    }

    if (state === "checking") {
        return (
            <button disabled className="atc-btn atc-loading" type="button">
                <span className="atc-spinner" />
            </button>
        );
    }

    if (state === "in-cart") {
        return (
            <button
                onClick={() => router.push("/cart")}
                className="atc-btn text-[#6B4E4E] atc-in-cart"
                type="button"
            >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M2 7.5l4 4 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                View Cart
            </button>
        );
    }

    return (
        <div className="atc-root" style={{ display: "contents" }}>
            {/* Quantity stepper + button in one row */}
            <div className="atc-row">
                <div className="qty-selector">
                    <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        disabled={quantity <= 1 || state === "loading"}
                        className="qty-btn" type="button" aria-label="Decrease"
                    >
                        <svg width="10" height="2" viewBox="0 0 10 2" fill="none">
                            <path d="M1 1h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                    <span className="qty-val">{quantity}</span>
                    <button
                        onClick={() => setQuantity(q => q + 1)}
                        disabled={state === "loading"}
                        className="qty-btn" type="button" aria-label="Increase"
                    >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <button
                    onClick={handleAddToCart}
                    disabled={state === "loading"}
                    type="button"
                    className={`atc-btn ${state === "loading" ? "atc-loading" : state === "error" ? "atc-error" : "atc-idle"}`}
                >
                    {state === "loading" && <><span className="atc-spinner" />Adding…</>}
                    {state === "error" && <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        </svg>
                        Retry
                    </>}
                    {state === "idle" && <>
                        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        </svg>
                        Add to Cart
                    </>}
                </button>
            </div>

            <style jsx>{`
                .atc-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    width: 100%;
                }

                /* Qty stepper */
                .qty-selector {
                    display: flex;
                    align-items: center;
                    border: 1.5px solid #E8DDD0;
                    border-radius: 100px;
                    background: #FAF7F2;
                    overflow: hidden;
                    height: 46px;
                    flex-shrink: 0;
                }
                .qty-btn {
                    width: 38px; height: 46px;
                    border: none; background: transparent;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; color: #6B3F2A;
                    transition: background 0.15s;
                }
                .qty-btn:hover:not(:disabled) { background: #EDD5C0; }
                .qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }
                .qty-val {
                    min-width: 32px; text-align: center;
                    font-size: 0.9rem; font-weight: 500; color: #6B3F2A;
                    border-left: 1.5px solid #E8DDD0;
                    border-right: 1.5px solid #E8DDD0;
                    line-height: 46px;
                }

                /* Buttons */
                .atc-btn {
                    flex: 1;
                    display: flex; align-items: center; justify-content: center; gap: 7px;
                    height: 46px;
                    padding: 0 20px;
                    border-radius: 100px; border: none;
                    font-size: 0.875rem; font-weight: 500; letter-spacing: 0.02em;
                    cursor: pointer; white-space: nowrap; font-family: inherit;
                    transition: all 0.2s ease;
                }
                .atc-idle {
                    background: #6B3F2A; color: white;
                    box-shadow: 0 3px 12px rgba(107,63,42,0.22);
                }
                .atc-idle:hover { background: #3D2314; box-shadow: 0 6px 20px rgba(107,63,42,0.28); transform: translateY(-1px); }
                .atc-idle:active { transform: translateY(0); }
                .atc-loading { background: #B8A090; color: white; cursor: not-allowed; }
                .atc-error   { background: #B83232; color: white; }
                .atc-error:hover { background: #9A2828; }
                .atc-in-cart {
                    width: 100%; flex: unset;
                    background: #EAF3EC; color: #2D6A40;
                    border: 1.5px solid #B8D4BB;
                    font-weight: 500;
                }
                .atc-in-cart:hover { background: #D4EBDA; }
                .atc-disabled {
                    width: 100%; flex: unset;
                    background: #EDE8E3; color: #A89080; cursor: not-allowed;
                    border: 1.5px solid #E0D8D0;
                }

                .atc-spinner {
                    width: 14px; height: 14px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.6s linear infinite;
                    flex-shrink: 0;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}