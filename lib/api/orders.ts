// lib/api/orders.ts
"use server";

import axios from "./axios";

export interface DeliveryDetails {
    recipientName: string;
    recipientPhone: string;
    email?: string;
    address: {
        street: string;
        city: string;
        state?: string;
        zip?: string;
        country: string;
    };
}

export async function getMyOrders(page = 1, limit = 10) {
    const res = await axios.get(`/api/orders?page=${page}&limit=${limit}`);
    return res.data;
}

export async function getMyOrderById(id: string) {
    const res = await axios.get(`/api/orders/${id}`);
    return res.data;
}

export async function placeOrder(
    paymentMethod: string,
    deliveryDetails: DeliveryDetails,
    notes?: string,
) {
    const res = await axios.post("/api/orders", { paymentMethod, notes, deliveryDetails });
    return res.data;
}

export async function cancelMyOrder(id: string, reason: string) {
    const res = await axios.patch(`/api/orders/${id}/cancel`, { reason });
    return res.data;
}

// ── Admin ──────────────────────────────────────────────────────────────────

export async function adminGetAllOrders(page = 1, limit = 10, status?: string) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.set("status", status);
    const res = await axios.get(`/api/admin/orders?${params}`);
    return res.data;
}

export async function adminGetOrderById(id: string) {
    const res = await axios.get(`/api/admin/orders/${id}`);
    return res.data;
}

export async function adminUpdateOrderStatus(id: string, status: string) {
    const res = await axios.patch(`/api/admin/orders/${id}/status`, { status });
    return res.data;
}

export async function adminCancelOrder(id: string, reason: string) {
    const res = await axios.patch(`/api/admin/orders/${id}/cancel`, { reason });
    return res.data;
}

// ── Admin Delivery ─────────────────────────────────────────────────────────

export async function adminGetAllDeliveries(page = 1, limit = 10, status?: string) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.set("status", status);
    const res = await axios.get(`/api/admin/deliveries?${params}`);
    return res.data;
}

export async function adminGetDeliveryByOrderId(orderId: string) {
    const res = await axios.get(`/api/admin/deliveries/order/${orderId}`);
    return res.data;
}

export async function adminGetDeliveryById(id: string) {
    const res = await axios.get(`/api/admin/deliveries/${id}`);
    return res.data;
}

export async function adminCreateDelivery(data: {
    orderId: string;
    recipientName: string;
    recipientPhone: string;
    address: { street: string; city: string; state?: string; zip?: string; country: string };
    scheduledDate?: string;
    estimatedDelivery?: string;
    deliveryNotes?: string;
}) {
    const res = await axios.post("/api/admin/deliveries", data);
    return res.data;
}

export async function adminUpdateDelivery(id: string, data: Record<string, any>) {
    const res = await axios.patch(`/api/admin/deliveries/${id}`, data);
    return res.data;
}

export async function adminAddTrackingUpdate(id: string, message: string) {
    const res = await axios.post(`/api/admin/deliveries/${id}/tracking`, { message });
    return res.data;
}

export async function adminCancelDelivery(id: string, reason: string) {
    const res = await axios.patch(`/api/admin/deliveries/${id}/cancel`, { reason });
    return res.data;
}