// lib/actions/order-action.ts
"use server";

import { revalidatePath } from "next/cache";
import * as orderApi from "../api/orders";
import type { DeliveryDetails } from "../api/orders";

export async function getMyOrdersAction(page = 1, limit = 10) {
    try {
        const res = await orderApi.getMyOrders(page, limit);
        if (res.success) return { success: true, data: res.data, pagination: res.pagination };
        return { success: false, message: res.message || "Failed to fetch orders" };
    } catch (err: any) {
        return { success: false, message: err.message || "Server error" };
    }
}

export async function getMyOrderByIdAction(id: string) {
    try {
        const res = await orderApi.getMyOrderById(id);
        if (res.success) return { success: true, data: res.data };
        return { success: false, message: res.message || "Order not found" };
    } catch (err: any) {
        return { success: false, message: err.message || "Server error" };
    }
}

export async function placeOrderAction(
    paymentMethod: string,
    deliveryDetails: DeliveryDetails,
    notes?: string,
) {
    try {
        const res = await orderApi.placeOrder(paymentMethod, deliveryDetails, notes);
        if (res.success) {
            revalidatePath("/cart");
            revalidatePath("/user/orders");
            return { success: true, data: res.data };
        }
        return { success: false, message: res.message || "Failed to place order" };
    } catch (err: any) {
        return { success: false, message: err.message || "Server error" };
    }
}

export async function cancelMyOrderAction(id: string, reason: string) {
    try {
        const res = await orderApi.cancelMyOrder(id, reason);
        if (res.success) {
            revalidatePath("/user/orders");
            return { success: true, data: res.data };
        }
        return { success: false, message: res.message || "Failed to cancel order" };
    } catch (err: any) {
        return { success: false, message: err.message || "Server error" };
    }
}

// ── Admin actions ──────────────────────────────────────────────────────────

export async function adminGetAllOrdersAction(page = 1, limit = 10, status?: string) {
    try {
        const res = await orderApi.adminGetAllOrders(page, limit, status);
        if (res.success) return { success: true, data: res.data, pagination: res.pagination };
        return { success: false, message: res.message || "Failed to fetch orders" };
    } catch (err: any) {
        return { success: false, message: err.message || "Server error" };
    }
}

export async function adminGetOrderByIdAction(id: string) {
    try {
        const res = await orderApi.adminGetOrderById(id);
        if (res.success) return { success: true, data: res.data };
        return { success: false, message: res.message || "Order not found" };
    } catch (err: any) {
        return { success: false, message: err.message || "Server error" };
    }
}

export async function adminUpdateOrderStatusAction(id: string, status: string) {
    try {
        const res = await orderApi.adminUpdateOrderStatus(id, status);
        if (res.success) {
            revalidatePath("/admin/orders");
            return { success: true, data: res.data };
        }
        return { success: false, message: res.message || "Failed to update status" };
    } catch (err: any) {
        return { success: false, message: err.message || "Server error" };
    }
}

export async function adminCancelOrderAction(id: string, reason: string) {
    try {
        const res = await orderApi.adminCancelOrder(id, reason);
        if (res.success) {
            revalidatePath("/admin/orders");
            return { success: true, data: res.data };
        }
        return { success: false, message: res.message || "Failed to cancel order" };
    } catch (err: any) {
        return { success: false, message: err.message || "Server error" };
    }
}

export async function adminGetAllDeliveriesAction(page = 1, limit = 10, status?: string) {
    try {
        const res = await orderApi.adminGetAllDeliveries(page, limit, status);
        if (res.success) return { success: true, data: res.data, pagination: res.pagination };
        return { success: false, message: res.message || "Failed to fetch deliveries" };
    } catch (err: any) {
        return { success: false, message: err.message || "Server error" };
    }
}

export async function adminGetDeliveryByOrderIdAction(orderId: string) {
    try {
        const res = await orderApi.adminGetDeliveryByOrderId(orderId);
        if (res.success) return { success: true, data: res.data };
        return { success: false, message: res.message || "No delivery found" };
    } catch (err: any) {
        return { success: false, message: err.message || "Server error" };
    }
}

export async function adminGetDeliveryByIdAction(id: string) {
    try {
        const res = await orderApi.adminGetDeliveryById(id);
        if (res.success) return { success: true, data: res.data };
        return { success: false, message: res.message || "Delivery not found" };
    } catch (err: any) {
        return { success: false, message: err.message || "Server error" };
    }
}

export async function adminCreateDeliveryAction(data: Parameters<typeof orderApi.adminCreateDelivery>[0]) {
    try {
        const res = await orderApi.adminCreateDelivery(data);
        if (res.success) {
            revalidatePath("/admin/deliveries");
            return { success: true, data: res.data };
        }
        return { success: false, message: res.message || "Failed to create delivery" };
    } catch (err: any) {
        return { success: false, message: err.message || "Server error" };
    }
}

export async function adminUpdateDeliveryAction(id: string, data: Record<string, any>) {
    try {
        const res = await orderApi.adminUpdateDelivery(id, data);
        if (res.success) {
            revalidatePath("/admin/deliveries");
            return { success: true, data: res.data };
        }
        return { success: false, message: res.message || "Failed to update delivery" };
    } catch (err: any) {
        return { success: false, message: err.message || "Server error" };
    }
}

export async function adminAddTrackingUpdateAction(id: string, message: string) {
    try {
        const res = await orderApi.adminAddTrackingUpdate(id, message);
        if (res.success) return { success: true, data: res.data };
        return { success: false, message: res.message || "Failed to add tracking" };
    } catch (err: any) {
        return { success: false, message: err.message || "Server error" };
    }
}

export async function adminCancelDeliveryAction(id: string, reason: string) {
    try {
        const res = await orderApi.adminCancelDelivery(id, reason);
        if (res.success) {
            revalidatePath("/admin/deliveries");
            return { success: true, data: res.data };
        }
        return { success: false, message: res.message || "Failed to cancel delivery" };
    } catch (err: any) {
        return { success: false, message: err.message || "Server error" };
    }
}