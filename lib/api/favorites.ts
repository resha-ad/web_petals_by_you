// lib/api/favorites.ts
"use server";

import axios from "./axios";

export async function getFavorites() {
    try {
        const res = await axios.get("/api/favorites");
        return res.data;
    } catch (err: any) {
        throw new Error(err?.response?.data?.message || "Failed to fetch favorites");
    }
}

export async function addToFavorites(type: "product" | "custom", refId: string) {
    try {
        const res = await axios.post("/api/favorites/add", { type, refId });
        return res.data;
    } catch (err: any) {
        throw new Error(err?.response?.data?.message || "Failed to add to favorites");
    }
}

export async function removeFromFavorites(refId: string) {
    try {
        const res = await axios.delete(`/api/favorites/remove/${refId}`);
        return res.data;
    } catch (err: any) {
        throw new Error(err?.response?.data?.message || "Failed to remove from favorites");
    }
}