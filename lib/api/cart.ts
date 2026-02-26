// lib/api/cart.ts
"use server";

import axios from "./axios";

export async function getCart() {
    try {
        const res = await axios.get("/api/cart");
        return res.data;
    } catch (err: any) {
        console.error("[getCart]", err?.response?.data || err.message);
        throw new Error(err?.response?.data?.message || "Failed to fetch cart");
    }
}

export async function updateCartQuantity(refId: string, quantity: number) {
    try {
        const res = await axios.put("/api/cart/update-quantity", { refId, quantity });
        return res.data;
    } catch (err: any) {
        throw new Error(err?.response?.data?.message || "Failed to update quantity");
    }
}

export async function removeFromCart(refId: string) {
    try {
        const res = await axios.delete(`/api/cart/remove/${refId}`);
        return res.data;
    } catch (err: any) {
        throw new Error(err?.response?.data?.message || "Failed to remove item");
    }
}

export async function clearCart() {
    try {
        const res = await axios.delete("/api/cart/clear");
        return res.data;
    } catch (err: any) {
        throw new Error(err?.response?.data?.message || "Failed to clear cart");
    }
}