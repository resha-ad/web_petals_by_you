// lib/api/items.ts
"use server"; // ← very important – marks this file as server-only

import axios from "./axios";
import { API } from "./endpoints";
import { getAuthToken } from "@/lib/cookie";

async function getAuthHeaders() {
    const token = await getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export const getAllItems = async (query = "") => {
    try {
        const authHeaders = await getAuthHeaders();
        const url = query ? `${API.ITEMS.LIST}?${query}` : API.ITEMS.LIST;
        const res = await axios.get(url, { headers: authHeaders });
        return res.data;
    } catch (err: any) {
        console.error("[getAllItems]", err?.response?.data || err.message);
        throw new Error(err.response?.data?.message || "Failed to fetch items");
    }
};

export const getItemById = async (id: string) => {
    try {
        const authHeaders = await getAuthHeaders();
        const res = await axios.get(API.ITEMS.GET_ONE(id), { headers: authHeaders });
        return res.data;
    } catch (err: any) {
        console.error("[getItemById]", err?.response?.data || err.message);
        throw new Error(err.response?.data?.message || "Item not found");
    }
};

export const getItemBySlug = async (slug: string) => {
    try {
        const authHeaders = await getAuthHeaders(); // even GET can be protected in some cases
        const res = await axios.get(API.ITEMS.GET_ONE(slug), { headers: authHeaders });
        return res.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.message || "Item not found");
    }
};

export const createItem = async (formData: FormData) => {
    try {
        const authHeaders = await getAuthHeaders();
        const res = await axios.post(API.ITEMS.CREATE, formData, {
            headers: {
                ...authHeaders,
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    } catch (err: any) {
        console.error("[createItem]", err?.response?.data || err.message);
        throw new Error(err.response?.data?.message || "Failed to create item");
    }
};

export const updateItem = async (id: string, formData: FormData) => {
    try {
        const authHeaders = await getAuthHeaders();
        const res = await axios.put(API.ITEMS.UPDATE(id), formData, {
            headers: {
                ...authHeaders,
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.message || "Failed to update item");
    }
};

export const deleteItem = async (id: string) => {
    try {
        const authHeaders = await getAuthHeaders();
        const res = await axios.delete(API.ITEMS.DELETE(id), { headers: authHeaders });
        return res.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.message || "Failed to delete item");
    }
};