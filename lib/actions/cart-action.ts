// lib/actions/cart-action.ts
"use server";

import { revalidatePath } from "next/cache";
import * as cartApi from "../api/cart";

type CartResponse = {
    success: boolean;
    data?: { items: any[]; total: number };
    message?: string;
};

function serializeCart(data: any) {
    return JSON.parse(JSON.stringify(data));
}

/**
 * Fetches product details by MongoDB ObjectId — used as a fallback only
 * if the backend didn't attach refDetails (e.g. older data or cache miss).
 */
async function fetchProductById(productId: string): Promise<any | null> {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
    const endpoints = [
        `${base}/api/items/${productId}`,
        `${base}/api/items?itemId=${productId}`,
    ];
    for (const url of endpoints) {
        try {
            const res = await fetch(url, { cache: "no-store" });
            if (res.ok) {
                const json = await res.json();
                const product = json?.data ?? json;
                if (product && (product.name || product.images)) return product;
            }
        } catch {
            continue;
        }
    }
    return null;
}

/**
 * Enriches cart items with product/bouquet details.
 * 
 * The fixed backend (cart.repository.ts) now attaches `refDetails` directly
 * on each item, so in the happy path this function is a no-op pass-through.
 * The fallback fetch only fires for edge cases (old cached data, etc.).
 */
async function enrichCartItems(cart: any): Promise<any> {
    if (!cart?.items?.length) return cart;

    const enriched = await Promise.all(
        cart.items.map(async (item: any) => {
            // ✅ New backend — refDetails already attached, nothing to do
            if (item.refDetails) return item;

            // Compat: refId was populated as an object with name/images
            if (item.refId && typeof item.refId === "object" && item.refId.name) {
                return { ...item, refDetails: item.refId };
            }

            // Custom bouquets: refDetails may have flowers/wrapping from backend
            // If missing, there's nothing to fetch from the Item model
            if (item.type === "custom") return item;

            // Product fallback: fetch details by ID
            const productId = typeof item.refId === "object"
                ? (item.refId._id ?? item.refId).toString()
                : String(item.refId);

            const product = await fetchProductById(productId);
            if (product) return { ...item, refDetails: product };

            return item;
        })
    );

    return { ...cart, items: enriched };
}

export async function getUserCartAction() {
    try {
        const result = await cartApi.getCart();
        if (result.success) {
            const cart = await enrichCartItems(serializeCart(result.data));
            return { success: true, cart };
        }
        return { success: false, message: result.message || "Cart unavailable" };
    } catch (err: any) {
        return { success: false, message: err.message || "Failed to load cart" };
    }
}

export async function updateQuantityAction(refId: string, quantity: number) {
    if (quantity < 1) return { success: false, message: "Quantity must be at least 1" };
    try {
        const result: CartResponse = await cartApi.updateCartQuantity(refId, quantity);
        if (result.success) {
            revalidatePath("/cart");
            const cart = await enrichCartItems(serializeCart(result.data));
            return { success: true, cart };
        }
        return { success: false, message: result.message };
    } catch (err: any) {
        return { success: false, message: err.message || "Failed to update quantity" };
    }
}

export async function removeItemAction(refId: string) {
    try {
        const result: CartResponse = await cartApi.removeFromCart(refId);
        if (result.success) {
            revalidatePath("/cart");
            const cart = await enrichCartItems(serializeCart(result.data));
            return { success: true, cart };
        }
        return { success: false, message: result.message };
    } catch (err: any) {
        return { success: false, message: err.message || "Failed to remove item" };
    }
}

export async function clearCartAction() {
    try {
        const result: CartResponse = await cartApi.clearCart();
        if (result.success) {
            revalidatePath("/cart");
            const cart = await enrichCartItems(serializeCart(result.data));
            return { success: true, cart };
        }
        return { success: false, message: result.message };
    } catch (err: any) {
        return { success: false, message: err.message || "Failed to clear cart" };
    }
}

export async function addToCartAction(itemId: string, quantity: number = 1) {
    try {
        const result = await cartApi.addToCart(itemId, quantity);
        if (result.success) {
            revalidatePath("/cart");
            const cart = await enrichCartItems(serializeCart(result.data));
            return { success: true, cart };
        }
        return { success: false, message: result.message || "Could not add item" };
    } catch (err: any) {
        return { success: false, message: err.message || "Failed to add to cart" };
    }
}