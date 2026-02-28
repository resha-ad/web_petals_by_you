// lib/api/notifications.ts
"use server";

import axios from "./axios";
import { getAuthToken } from "@/lib/cookie";

const BASE = "/api/notifications";

async function authHeaders() {
    const token = await getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── User API ──────────────────────────────────────────────────────────────────

export const getMyNotifications = async () => {
    try {
        const headers = await authHeaders();
        const res = await axios.get(`${BASE}/my`, { headers });
        return res.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.message || "Failed to fetch notifications");
    }
};

export const markNotificationRead = async (id: string) => {
    try {
        const headers = await authHeaders();
        const res = await axios.patch(`${BASE}/${id}/read`, {}, { headers });
        return res.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.message || "Failed to mark as read");
    }
};

export const markAllNotificationsRead = async () => {
    try {
        const headers = await authHeaders();
        const res = await axios.patch(`${BASE}/read-all`, {}, { headers });
        return res.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.message || "Failed to mark all as read");
    }
};

export const clearNotification = async (id: string) => {
    try {
        const headers = await authHeaders();
        const res = await axios.patch(`${BASE}/${id}/clear`, {}, { headers });
        return res.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.message || "Failed to clear notification");
    }
};

export const clearAllNotifications = async () => {
    try {
        const headers = await authHeaders();
        const res = await axios.patch(`${BASE}/clear-all`, {}, { headers });
        return res.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.message || "Failed to clear all notifications");
    }
};

// ── Admin API ─────────────────────────────────────────────────────────────────

export const createNotification = async (data: {
    title: string;
    message: string;
    type?: string;
    targetRole?: string;
}) => {
    try {
        const headers = await authHeaders();
        const res = await axios.post(BASE, data, { headers });
        return res.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.message || "Failed to create notification");
    }
};

export const getAllNotificationsAdmin = async (page = 1, limit = 20) => {
    try {
        const headers = await authHeaders();
        const res = await axios.get(`${BASE}?page=${page}&limit=${limit}`, { headers });
        return res.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.message || "Failed to fetch notifications");
    }
};

export const updateNotificationAdmin = async (id: string, data: object) => {
    try {
        const headers = await authHeaders();
        const res = await axios.put(`${BASE}/${id}`, data, { headers });
        return res.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.message || "Failed to update notification");
    }
};

export const deleteNotificationAdmin = async (id: string) => {
    try {
        const headers = await authHeaders();
        const res = await axios.delete(`${BASE}/${id}`, { headers });
        return res.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.message || "Failed to delete notification");
    }
};