// lib/actions/item-action.ts
"use server";

import { revalidatePath } from "next/cache";
import { createItem, updateItem, deleteItem, getAllItems } from "../api/items";

// Create new item
export async function handleCreateItem(formData: FormData) {
    try {
        const res = await createItem(formData);
        if (res.success) {
            revalidatePath("/admin/items");
            revalidatePath("/shop");
            return { success: true, data: res.data };
        }
        return { success: false, message: res.message || "Failed to create item" };
    } catch (err: any) {
        return { success: false, message: err.message || "Server error" };
    }
}

// Update existing item
export async function handleUpdateItem(id: string, formData: FormData) {
    try {
        const res = await updateItem(id, formData);
        if (res.success) {
            revalidatePath("/admin/items");
            revalidatePath(`/shop/${res.data.slug}`);
            revalidatePath(`/admin/items/${id}`);
            return { success: true, data: res.data };
        }
        return { success: false, message: res.message || "Failed to update item" };
    } catch (err: any) {
        return { success: false, message: err.message || "Server error" };
    }
}

// Delete item
export async function handleDeleteItem(id: string) {
    try {
        const res = await deleteItem(id);
        if (res.success) {
            revalidatePath("/admin/items");
            revalidatePath("/shop");
            return { success: true, message: "Item deleted successfully" };
        }
        return { success: false, message: res.message || "Failed to delete item" };
    } catch (err: any) {
        return { success: false, message: err.message || "Server error during deletion" };
    }
}

// Get all items (with pagination, optional search & category filter)
export async function handleGetAllItems(
    page: number = 1,
    limit: number = 10,
    search?: string,
    category?: string,   // ← added
) {
    try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (search) params.append("search", search);
        if (category) params.append("category", category);   // ← passed to backend

        const response = await getAllItems(params.toString());

        if (response.success) {
            return {
                success: true,
                data: {
                    items: response.data?.items || [],
                    pagination: response.data?.pagination || {
                        page,
                        limit,
                        total: 0,
                        totalPages: 0,
                    },
                },
            };
        }

        return { success: false, message: response.message || "Failed to fetch items" };
    } catch (err: any) {
        return { success: false, message: err.message || "Server error while fetching items" };
    }
}