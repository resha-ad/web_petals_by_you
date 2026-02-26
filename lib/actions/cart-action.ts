// lib/actions/cart-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import * as cartApi from "../api/cart";

type CartResponse = {
    success: boolean;
    data?: { items: any[]; total: number };
    message?: string;
};

export async function getUserCartAction() {
    console.log("[getUserCartAction] Starting...");
    try {
        const result = await cartApi.getCart();
        console.log("[getUserCartAction] Success:", !!result.success);
        if (result.success) {
            return { success: true, cart: result.data };
        }
        return { success: false, message: result.message || "Cart unavailable" };
    } catch (err: any) {
        console.error("[getUserCartAction] Error:", err.message);
        return { success: false, message: err.message || "Failed to load cart" };
    }
}

export async function updateQuantityAction(refId: string, quantity: number) {
    if (quantity < 1) {
        return { success: false, message: "Quantity must be at least 1" };
    }

    try {
        const result: CartResponse = await cartApi.updateCartQuantity(refId, quantity);
        if (result.success) {
            revalidatePath("/cart");
            return { success: true, cart: result.data };
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
            return { success: true, cart: result.data };
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
            return { success: true, cart: result.data };
        }
        return { success: false, message: result.message };
    } catch (err: any) {
        return { success: false, message: err.message || "Failed to clear cart" };
    }
}