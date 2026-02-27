// app/user/orders/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getMyOrdersAction } from "@/lib/actions/order-action";

type OrderStatus = "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; dot: string }> = {
    pending: { label: "Pending", color: "#92400E", bg: "#FEF3C7", dot: "#F59E0B" },
    confirmed: { label: "Confirmed", color: "#1E40AF", bg: "#DBEAFE", dot: "#3B82F6" },
    preparing: { label: "Preparing", color: "#5B21B6", bg: "#EDE9FE", dot: "#8B5CF6" },
    out_for_delivery: { label: "Out for Delivery", color: "#065F46", bg: "#D1FAE5", dot: "#10B981" },
    delivered: { label: "Delivered", color: "#166534", bg: "#DCFCE7", dot: "#22C55E" },
    cancelled: { label: "Cancelled", color: "#991B1B", bg: "#FEE2E2", dot: "#EF4444" },
};

function StatusBadge({ status }: { status: OrderStatus }) {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "3px 10px", borderRadius: 100,
            background: cfg.bg, color: cfg.color,
            fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.03em",
        }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
            {cfg.label}
        </span>
    );
}

export default function UserOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const res = await getMyOrdersAction(page, 8);
            if (res.success) {
                setOrders(res.data || []);
                setPagination(res.pagination || { page: 1, totalPages: 1, total: 0 });
            }
            setLoading(false);
        })();
    }, [page]);

    return (
        <div style={{ minHeight: "100vh", background: "#FBF6F4", padding: "32px 16px" }}>
            <div style={{ maxWidth: 860, margin: "0 auto" }}>

                {/* Header */}
                <div style={{ marginBottom: 28 }}>
                    <Link href="/user/dashboard" style={{ fontSize: "0.8rem", color: "#9A7A7A", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 10 }}>
                        ← Back to Dashboard
                    </Link>
                    <h1 style={{ fontSize: "1.9rem", fontFamily: "Georgia, serif", color: "#6B4E4E", margin: 0 }}>My Orders</h1>
                    {!loading && <p style={{ color: "#9A7A7A", fontSize: "0.85rem", marginTop: 4 }}>{pagination.total} order{pagination.total !== 1 ? "s" : ""} total</p>}
                </div>

                {loading ? (
                    <div style={{ textAlign: "center", padding: 80, color: "#9A7A7A" }}>
                        <div style={{ fontSize: "2rem", marginBottom: 12 }}>🌸</div>
                        <p>Loading your orders…</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div style={{ textAlign: "center", padding: 80, background: "white", borderRadius: 16, border: "1px solid #F3E6E6" }}>
                        <div style={{ fontSize: "3rem", marginBottom: 12 }}>🛍️</div>
                        <h2 style={{ color: "#6B4E4E", fontFamily: "Georgia, serif", marginBottom: 8 }}>No orders yet</h2>
                        <p style={{ color: "#9A7A7A", marginBottom: 20 }}>When you place orders, they'll appear here.</p>
                        <Link href="/shop" style={{ padding: "10px 24px", background: "#6B4E4E", color: "white", borderRadius: 100, textDecoration: "none", fontSize: "0.875rem" }}>
                            Browse Shop
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {orders.map((order: any) => (
                            <Link key={order._id} href={`/user/orders/${order._id}`} style={{ textDecoration: "none" }}>
                                <div style={{
                                    background: "white", borderRadius: 14, padding: "18px 22px",
                                    border: "1px solid #F3E6E6", display: "flex", alignItems: "center",
                                    justifyContent: "space-between", gap: 12, cursor: "pointer",
                                    transition: "box-shadow 0.15s",
                                }}
                                    onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(107,78,78,0.10)")}
                                    onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
                                >
                                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <span style={{ fontSize: "0.7rem", color: "#9A7A7A", fontFamily: "monospace" }}>
                                                #{order._id.slice(-8).toUpperCase()}
                                            </span>
                                            <StatusBadge status={order.status} />
                                            {order.cancelledBy && (
                                                <span style={{ fontSize: "0.68rem", color: "#9A7A7A" }}>
                                                    by {order.cancelledBy}
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ fontSize: "0.82rem", color: "#7A6060" }}>
                                            {order.items?.length} item{order.items?.length !== 1 ? "s" : ""} ·{" "}
                                            {order.items?.slice(0, 2).map((i: any) => i.name).join(", ")}
                                            {order.items?.length > 2 ? ` +${order.items.length - 2} more` : ""}
                                        </div>
                                        {order.cancelReason && (
                                            <div style={{ fontSize: "0.75rem", color: "#EF4444" }}>
                                                ✕ {order.cancelReason}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                                        <div style={{ fontWeight: 700, color: "#6B4E4E", fontSize: "1rem" }}>
                                            Rs. {order.totalAmount?.toLocaleString()}
                                        </div>
                                        <div style={{ fontSize: "0.72rem", color: "#9A7A7A", marginTop: 2 }}>
                                            {new Date(order.createdAt).toLocaleDateString("en-NP", { day: "numeric", month: "short", year: "numeric" })}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginTop: 28 }}>
                        <button
                            onClick={() => setPage(p => p - 1)} disabled={page === 1}
                            style={{ padding: "8px 20px", borderRadius: 100, border: "1px solid #E8D4D4", background: page === 1 ? "#F5F5F5" : "white", color: page === 1 ? "#C0A090" : "#6B4E4E", cursor: page === 1 ? "not-allowed" : "pointer", fontSize: "0.85rem" }}
                        >
                            ← Previous
                        </button>
                        <span style={{ fontSize: "0.85rem", color: "#9A7A7A" }}>Page {page} of {pagination.totalPages}</span>
                        <button
                            onClick={() => setPage(p => p + 1)} disabled={page === pagination.totalPages}
                            style={{ padding: "8px 20px", borderRadius: 100, border: "1px solid #E8D4D4", background: page === pagination.totalPages ? "#F5F5F5" : "white", color: page === pagination.totalPages ? "#C0A090" : "#6B4E4E", cursor: page === pagination.totalPages ? "not-allowed" : "pointer", fontSize: "0.85rem" }}
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}