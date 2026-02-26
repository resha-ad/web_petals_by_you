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
 * Fetches product details by MongoDB ObjectId.
 * Tries /api/items?id=<id> first, then /api/items/<id> as fallback.
 */
async function fetchProductById(productId: string): Promise<any | null> {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

    // Try common patterns for ID-based lookup
    const endpoints = [
        `${base}/api/items/${productId}`,        // some backends accept ObjectId as slug param
        `${base}/api/items?itemId=${productId}`, // query param variant
    ];

    for (const url of endpoints) {
        try {
            const res = await fetch(url, { cache: "no-store" });
            if (res.ok) {
                const json = await res.json();
                const product = json?.data ?? json;
                // Make sure we got a real product (has name or images)
                if (product && (product.name || product.images)) {
                    return product;
                }
            }
        } catch {
            continue;
        }
    }
    return null;
}

/**
 * When populate() doesn't survive the serialization boundary,
 * this manually fetches product data for each product-type cart item
 * and attaches it as item.details.
 */
async function enrichCartItems(cart: any): Promise<any> {
    if (!cart?.items?.length) return cart;

    const enriched = await Promise.all(
        cart.items.map(async (item: any) => {
            // Already populated — refId is an object with name/images
            if (item.refId && typeof item.refId === "object" && item.refId.name) {
                return { ...item, details: item.refId };
            }

            // Custom bouquets: refId points to CustomBouquet, not Item
            if (item.type === "custom") return item;

            // Product: fetch details by ID
            const productId = typeof item.refId === "object"
                ? (item.refId._id ?? item.refId).toString()
                : String(item.refId);

            const product = await fetchProductById(productId);
            if (product) {
                return { ...item, details: product };
            }
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