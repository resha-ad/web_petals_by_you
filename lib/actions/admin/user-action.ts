"use server";

import {
    createUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
} from "@/lib/api/admin/user";
import { revalidatePath } from "next/cache";

// Create
export const handleCreateUser = async (formData: FormData) => {
    try {
        const response = await createUser(formData);
        if (response.success) {
            revalidatePath("/admin/users");
            return { success: true, data: response.data };
        }
        return { success: false, message: response.message || "Failed to create user" };
    } catch (err: any) {
        return { success: false, message: err.message || "Server error" };
    }
};

// List all
export const handleGetAllUsers = async () => {
    try {
        const response = await getAllUsers();
        return { success: true, data: response.data || [] };
    } catch (err: any) {
        return { success: false, message: err.message || "Failed to fetch users" };
    }
};

// Get one
export const handleGetUserById = async (id: string) => {
    try {
        const response = await getUserById(id);
        return { success: true, data: response.data };
    } catch (err: any) {
        return { success: false, message: err.message || "User not found" };
    }
};

// Update
export const handleUpdateUser = async (id: string, formData: FormData) => {
    try {
        const response = await updateUserById(id, formData);
        if (response.success) {
            revalidatePath("/admin/users");
            revalidatePath(`/admin/users/${id}`);
            return { success: true, data: response.data };
        }
        return { success: false, message: response.message || "Update failed" };
    } catch (err: any) {
        return { success: false, message: err.message || "Server error" };
    }
};

// Delete
export const handleDeleteUser = async (id: string) => {
    try {
        const response = await deleteUserById(id);
        if (response.success) {
            revalidatePath("/admin/users");
            return { success: true, message: "User deleted" };
        }
        return { success: false, message: response.message || "Delete failed" };
    } catch (err: any) {
        return { success: false, message: err.message || "Server error" };
    }
};