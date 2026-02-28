// This module fetches items without authentication — safe for public pages
// No "use server" needed since it uses fetch directly with the public API

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

export async function getPublicFeaturedItems(limit = 6) {
    try {
        const res = await fetch(
            `${API_BASE}/api/items?featured=true&limit=${limit}`,
            {
                // No credentials, no auth headers — public endpoint
                cache: "no-store",
            }
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        return {
            success: true,
            items: (data.data?.items ?? []) as any[],
        };
    } catch (err: any) {
        return { success: false, items: [] };
    }
}

export async function getPublicItems(page = 1, limit = 12, query = "") {
    try {
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
        });
        if (query) params.set("search", query);

        const res = await fetch(`${API_BASE}/api/items?${params.toString()}`, {
            cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        return {
            success: true,
            items: (data.data?.items ?? []) as any[],
            pagination: data.data?.pagination ?? {},
        };
    } catch (err: any) {
        return { success: false, items: [], pagination: {} };
    }
}