// lib/api/custom-bouquet.ts
"use server";

import axios from "../api/axios";

interface AddCustomBouquetPayload {
    flowers: Array<{
        flowerId: string;
        name: string;
        count: number;
        pricePerStem: number;
    }>;
    wrapping: {
        id: string;
        name: string;
        price: number;
    } | null;
    note: string;
    recipientName: string;
    totalPrice: number;
}

export async function addCustomBouquetToCart(payload: AddCustomBouquetPayload) {
    try {
        const res = await axios.post("/api/custom-bouquets", payload);
        return res.data;
    } catch (err: any) {
        console.error("[addCustomBouquetToCart]", err?.response?.data || err.message);
        throw new Error(
            err?.response?.data?.message || "Failed to add custom bouquet to cart"
        );
    }
}