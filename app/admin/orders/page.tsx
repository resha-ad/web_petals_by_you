// app/admin/orders/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { adminGetAllOrdersAction } from "@/lib/actions/order-action";

type OrderStatus = "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
    pending: { label: "Pending", color: "#92400E", bg: "#FEF3C7", dot: "#F59E0B" },
    confirmed: { label: "Confirmed", color: "#1E40AF", bg: "#DBEAFE", dot: "#3B82F6" },
    preparing: { label: "Preparing", color: "#5B21B6", bg: "#EDE9FE", dot: "#8B5CF6" },
    out_for_delivery: { label: "Out for Delivery", color: "#065F46", bg: "#D1FAE5", dot: "#10B981" },
    delivered: { label: "Delivered", color: "#166534", bg: "#DCFCE7", dot: "#22C55E" },
    cancelled: { label: "Cancelled", color: "#991B1B", bg: "#FEE2E2", dot: "#EF4444" },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG) as OrderStatus[];

function StatusBadge({ status }: { status: string }) {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "3px 10px", borderRadius: 100,
            background: cfg.bg, color: cfg.color,
            fontSize: "0.72rem", fontWeight: 600,
        }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
            {cfg.label}
        </span>
    );
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string>("");

    const load = async () => {
        setLoading(true);
        const res = await adminGetAllOrdersAction(page, 15, statusFilter || undefined);
        if (res.success) {
            setOrders(res.data || []);
            setPagination(res.pagination || { page: 1, totalPages: 1, total: 0 });
        }
        setLoading(false);
    };

    useEffect(() => { load(); }, [page, statusFilter]);

    const handleFilterChange = (s: string) => {
        setStatusFilter(s);
        setPage(1);
    };

    return (
        <div style={{ padding: "24px", maxWidth: 1100, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                <div>
                    <h1 style={{ fontFamily: "Georgia, serif", color: "#6B4E4E", fontSize: "1.6rem", margin: "0 0 4px" }}>
                        Orders
                    </h1>
                    {!loading && (
                        <p style={{ color: "#9A7A7A", fontSize: "0.82rem", margin: 0 }}>
                            {pagination.total} order{pagination.total !== 1 ? "s" : ""} total
                        </p>
                    )}
                </div>
            </div>

            {/* Status filter tabs */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                <button
                    onClick={() => handleFilterChange("")}
                    style={{
                        padding: "6px 14px", borderRadius: 100, border: "1.5px solid",
                        borderColor: statusFilter === "" ? "#6B4E4E" : "#E8D4D4",
                        background: statusFilter === "" ? "#6B4E4E" : "white",
                        color: statusFilter === "" ? "white" : "#9A7A7A",
                        fontSize: "0.78rem", cursor: "pointer", fontFamily: "inherit",
                    }}
                >
                    All
                </button>
                {ALL_STATUSES.map(s => {
                    const cfg = STATUS_CONFIG[s];
                    const active = statusFilter === s;
                    return (
                        <button
                            key={s}
                            onClick={() => handleFilterChange(s)}
                            style={{
                                padding: "6px 14px", borderRadius: 100, border: "1.5px solid",
                                borderColor: active ? cfg.color : "#E8D4D4",
                                background: active ? cfg.bg : "white",
                                color: active ? cfg.color : "#9A7A7A",
                                fontSize: "0.78rem", cursor: "pointer", fontFamily: "inherit",
                                fontWeight: active ? 600 : 400,
                            }}
                        >
                            {cfg.label}
                        </button>
                    );
                })}
            </div>

            {/* Table */}
            {loading ? (
                <div style={{ padding: 60, textAlign: "center", color: "#9A7A7A" }}>
                    <div style={{ width: 28, height: 28, border: "3px solid #F3E6E6", borderTopColor: "#6B4E4E", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 12px" }} />
                    Loading orders…
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            ) : orders.length === 0 ? (
                <div style={{ padding: 60, textAlign: "center", background: "white", borderRadius: 14, border: "1px solid #F3E6E6", color: "#9A7A7A" }}>
                    No orders found{statusFilter ? ` with status "${STATUS_CONFIG[statusFilter]?.label}"` : ""}.
                </div>
            ) : (
                <div style={{ background: "white", borderRadius: 14, border: "1px solid #F3E6E6", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                        <thead>
                            <tr style={{ borderBottom: "1.5px solid #F3E6E6", background: "#FBF6F4" }}>
                                {["Order ID", "Customer", "Items", "Total", "Payment", "Status", "Date", ""].map(h => (
                                    <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: "0.68rem", fontWeight: 700, color: "#9A7A7A", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order: any, idx: number) => (
                                <tr
                                    key={order._id}
                                    style={{ borderBottom: idx < orders.length - 1 ? "1px solid #F9F0EE" : "none" }}
                                >
                                    <td style={{ padding: "12px 16px" }}>
                                        <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#6B4E4E", fontWeight: 600 }}>
                                            #{order._id.slice(-8).toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: "12px 16px" }}>
                                        <p style={{ margin: 0, fontWeight: 500, color: "#6B4E4E" }}>
                                            {order.userId?.firstName || ""} {order.userId?.lastName || ""}
                                        </p>
                                        <p style={{ margin: "1px 0 0", fontSize: "0.7rem", color: "#9A7A7A" }}>
                                            {order.userId?.email || "—"}
                                        </p>
                                    </td>
                                    <td style={{ padding: "12px 16px", color: "#7A6060" }}>
                                        <span>{order.items?.length} item{order.items?.length !== 1 ? "s" : ""}</span>
                                        <p style={{ margin: "2px 0 0", fontSize: "0.72rem", color: "#B0A0A0" }}>
                                            {order.items?.slice(0, 1).map((i: any) => i.name).join("")}
                                            {order.items?.length > 1 ? ` +${order.items.length - 1} more` : ""}
                                        </p>
                                    </td>
                                    <td style={{ padding: "12px 16px", fontWeight: 700, color: "#6B4E4E" }}>
                                        Rs. {order.totalAmount?.toLocaleString()}
                                    </td>
                                    <td style={{ padding: "12px 16px" }}>
                                        <span style={{
                                            fontSize: "0.72rem", fontWeight: 600,
                                            color: order.paymentStatus === "paid" ? "#166534" : "#92400E",
                                            textTransform: "capitalize",
                                        }}>
                                            {order.paymentStatus}
                                        </span>
                                        <p style={{ margin: "1px 0 0", fontSize: "0.68rem", color: "#B0A0A0", textTransform: "capitalize" }}>
                                            {order.paymentMethod?.replace(/_/g, " ")}
                                        </p>
                                    </td>
                                    <td style={{ padding: "12px 16px" }}>
                                        <StatusBadge status={order.status} />
                                        {order.cancelledBy && (
                                            <p style={{ margin: "3px 0 0", fontSize: "0.68rem", color: "#9A7A7A" }}>
                                                by {order.cancelledBy}
                                            </p>
                                        )}
                                    </td>
                                    <td style={{ padding: "12px 16px", color: "#9A7A7A", whiteSpace: "nowrap" }}>
                                        {new Date(order.createdAt).toLocaleDateString("en-NP", {
                                            day: "numeric", month: "short", year: "numeric",
                                        })}
                                    </td>
                                    <td style={{ padding: "12px 16px" }}>
                                        <Link
                                            href={`/admin/orders/${order._id}`}
                                            style={{
                                                padding: "5px 14px", borderRadius: 100,
                                                border: "1.5px solid #E8D4D4", color: "#6B4E4E",
                                                fontSize: "0.75rem", textDecoration: "none",
                                                whiteSpace: "nowrap", display: "inline-block",
                                            }}
                                        >
                                            View →
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginTop: 24 }}>
                    <button
                        onClick={() => setPage(p => p - 1)}
                        disabled={page === 1}
                        style={{ padding: "8px 20px", borderRadius: 100, border: "1px solid #E8D4D4", background: page === 1 ? "#F5F5F5" : "white", color: page === 1 ? "#C0A090" : "#6B4E4E", cursor: page === 1 ? "not-allowed" : "pointer", fontSize: "0.82rem", fontFamily: "inherit" }}
                    >
                        ← Previous
                    </button>
                    <span style={{ fontSize: "0.82rem", color: "#9A7A7A" }}>
                        Page {page} of {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={page === pagination.totalPages}
                        style={{ padding: "8px 20px", borderRadius: 100, border: "1px solid #E8D4D4", background: page === pagination.totalPages ? "#F5F5F5" : "white", color: page === pagination.totalPages ? "#C0A090" : "#6B4E4E", cursor: page === pagination.totalPages ? "not-allowed" : "pointer", fontSize: "0.82rem", fontFamily: "inherit" }}
                    >
                        Next →
                    </button>
                </div>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}