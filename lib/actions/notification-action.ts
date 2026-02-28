"use server";

// lib/actions/notification-action.ts

import {
    getMyNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotification,
    clearAllNotifications,
    createNotification,
    getAllNotificationsAdmin,
    updateNotificationAdmin,
    deleteNotificationAdmin,
} from "@/lib/api/notifications";
import { revalidatePath } from "next/cache";

// ── User actions ──────────────────────────────────────────────────────────────

export const getMyNotificationsAction = async () => {
    try {
        return await getMyNotifications();
    } catch (err: any) {
        return { success: false, message: err.message };
    }
};

export const markNotificationReadAction = async (id: string) => {
    try {
        return await markNotificationRead(id);
    } catch (err: any) {
        return { success: false, message: err.message };
    }
};

export const markAllNotificationsReadAction = async () => {
    try {
        return await markAllNotificationsRead();
    } catch (err: any) {
        return { success: false, message: err.message };
    }
};

export const clearNotificationAction = async (id: string) => {
    try {
        return await clearNotification(id);
    } catch (err: any) {
        return { success: false, message: err.message };
    }
};

export const clearAllNotificationsAction = async () => {
    try {
        return await clearAllNotifications();
    } catch (err: any) {
        return { success: false, message: err.message };
    }
};

// ── Admin actions ─────────────────────────────────────────────────────────────

export const createNotificationAction = async (data: {
    title: string;
    message: string;
    type?: string;
    targetRole?: string;
}) => {
    try {
        const result = await createNotification(data);
        revalidatePath("/admin/notifications");
        return result;
    } catch (err: any) {
        return { success: false, message: err.message };
    }
};

export const getAllNotificationsAdminAction = async (page = 1, limit = 20) => {
    try {
        return await getAllNotificationsAdmin(page, limit);
    } catch (err: any) {
        return { success: false, message: err.message };
    }
};

export const updateNotificationAction = async (id: string, data: object) => {
    try {
        const result = await updateNotificationAdmin(id, data);
        revalidatePath("/admin/notifications");
        return result;
    } catch (err: any) {
        return { success: false, message: err.message };
    }
};

export const deleteNotificationAction = async (id: string) => {
    try {
        const result = await deleteNotificationAdmin(id);
        revalidatePath("/admin/notifications");
        return result;
    } catch (err: any) {
        return { success: false, message: err.message };
    }
};