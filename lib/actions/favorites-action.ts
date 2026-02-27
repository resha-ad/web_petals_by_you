// lib/actions/favorites-action.ts
"use server";

import { revalidatePath } from "next/cache";
import * as favoritesApi from "../api/favorites";

function serialize(data: any) {
    return JSON.parse(JSON.stringify(data));
}

/**
 * Normalizes items whether refId is a populated object OR a plain string.
 * If it's a plain string (populate didn't survive), we enrich via fetchProductById.
 */
function extractItems(rawItems: any[]): { normalized: any[]; needsEnrichment: string[] } {
    const normalized: any[] = [];
    const needsEnrichment: string[] = [];

    for (const item of rawItems) {
        const isPopulated =
            item.refId &&
            typeof item.refId === "object" &&
            (item.refId.name || item.refId.images);

        const refId = isPopulated
            ? (item.refId._id ?? item.refId).toString()
            : String(item.refId ?? "");

        normalized.push({
            _id: item._id?.toString() ?? refId,
            type: item.type,
            refId,
            details: isPopulated ? item.refId : null,
        });

        if (!isPopulated && item.type === "product") {
            needsEnrichment.push(refId);
        }
    }

    return { normalized, needsEnrichment };
}

/**
 * Fetch product by ObjectId — tries the items API.
 * Works with both slug-based and id-based routes.
 */
async function fetchProductById(productId: string): Promise<any | null> {
    const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

    // Try common route patterns
    for (const url of [
        `${base}/api/items/id/${productId}`,
        `${base}/api/items/${productId}`,
    ]) {
        try {
            const res = await fetch(url, { cache: "no-store" });
            if (res.ok) {
                const json = await res.json();
                const product = json?.data ?? json;
                if (product && (product.name || product.images)) return product;
            }
        } catch { continue; }
    }
    return null;
}

/**
 * For any items where populate failed (refId arrived as plain string),
 * fetch product details individually and attach as .details.
 */
async function enrichItems(items: any[]): Promise<any[]> {
    return Promise.all(
        items.map(async (item) => {
            if (item.details || item.type !== "product") return item;
            const product = await fetchProductById(item.refId);
            return product ? { ...item, details: product } : item;
        })
    );
}

async function processFavorites(data: any) {
    const raw = serialize(data);
    if (!raw?.items?.length) return { ...raw, items: [] };
    const { normalized } = extractItems(raw.items);
    const enriched = await enrichItems(normalized);
    return { ...raw, items: enriched };
}

export async function getFavoritesAction() {
    try {
        const result = await favoritesApi.getFavorites();
        if (result.success) {
            return { success: true, favorites: await processFavorites(result.data) };
        }
        return { success: false, message: result.message || "Favorites unavailable" };
    } catch (err: any) {
        return { success: false, message: err.message || "Failed to load favorites" };
    }
}

export async function addToFavoritesAction(type: "product" | "custom", refId: string) {
    try {
        const result = await favoritesApi.addToFavorites(type, refId);
        if (result.success) {
            revalidatePath("/favorites");
            return { success: true, favorites: await processFavorites(result.data) };
        }
        return { success: false, message: result.message || "Could not add to favorites" };
    } catch (err: any) {
        return { success: false, message: err.message || "Failed to add to favorites" };
    }
}

export async function removeFromFavoritesAction(refId: string) {
    try {
        const result = await favoritesApi.removeFromFavorites(refId);
        if (result.success) {
            revalidatePath("/favorites");
            return { success: true, favorites: await processFavorites(result.data) };
        }
        return { success: false, message: result.message || "Could not remove from favorites" };
    } catch (err: any) {
        return { success: false, message: err.message || "Failed to remove from favorites" };
    }
}

export async function checkIsFavoritedAction(itemId: string): Promise<boolean> {
    try {
        const result = await favoritesApi.getFavorites();
        if (result.success && result.data?.items) {
            return result.data.items.some((item: any) => {
                const id =
                    typeof item.refId === "object"
                        ? (item.refId._id ?? item.refId).toString()
                        : String(item.refId);
                return id === itemId;
            });
        }
        return false;
    } catch {
        return false;
    }
}