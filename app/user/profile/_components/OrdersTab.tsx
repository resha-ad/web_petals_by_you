// app/user/profile/_components/OrdersTab.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getMyOrdersAction, cancelMyOrderAction } from "@/lib/actions/order-action";

type OrderStatus =
    | "pending" | "confirmed" | "preparing"
    | "out_for_delivery" | "delivered" | "cancelled";

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
            fontSize: "0.68rem", fontWeight: 600,
        }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
            {cfg.label}
        </span>
    );
}

export default function OrdersTab() {
    const [orders, setOrders] = useState<any[]>([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [cancelModal, setCancelModal] = useState<{ id: string } | null>(null);
    const [cancelReason, setCancelReason] = useState("");
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    const load = async () => {
        setLoading(true);
        const res = await getMyOrdersAction(page, 5);
        if (res.success) {
            setOrders(res.data || []);
            setPagination(res.pagination || { page: 1, totalPages: 1, total: 0 });
        }
        setLoading(false);
    };

    useEffect(() => { load(); }, [page]);

    const handleCancel = async () => {
        if (!cancelModal || !cancelReason.trim()) return;
        setCancellingId(cancelModal.id);
        const res = await cancelMyOrderAction(cancelModal.id, cancelReason);
        if (res.success) { setCancelModal(null); setCancelReason(""); await load(); }
        else alert(res.message || "Could not cancel order");
        setCancellingId(null);
    };

    if (loading) return (
        <div style={{ textAlign: "center", padding: "36px 0", color: "#9A7A7A" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>🌸</div>
            <p style={{ margin: 0 }}>Loading orders…</p>
        </div>
    );

    if (orders.length === 0) return (
        <div style={{ textAlign: "center", padding: "36px 0" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>🛍️</div>
            <p style={{ color: "#9A7A7A", marginBottom: 16, fontSize: "0.9rem" }}>No orders placed yet.</p>
            <Link href="/shop" style={{
                display: "inline-block", padding: "9px 22px", background: "#6B4E4E",
                color: "white", borderRadius: 100, textDecoration: "none", fontSize: "0.85rem",
            }}>
                Browse Shop
            </Link>
        </div>
    );

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                {orders.map((order: any) => (
                    <div key={order._id} style={{
                        border: "1.5px solid #F3E6E6", borderRadius: 12,
                        padding: "14px 16px", background: "#FDFBFB",
                        transition: "border-color 0.15s",
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, flexWrap: "wrap" }}>
                            {/* Left: meta */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                                    <span style={{ fontFamily: "monospace", fontSize: "0.68rem", color: "#B0A0A0" }}>
                                        #{order._id.slice(-8).toUpperCase()}
                                    </span>
                                    <StatusBadge status={order.status} />
                                </div>
                                <p style={{ margin: "0 0 3px", fontSize: "0.82rem", color: "#7A6060", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {order.items?.slice(0, 2).map((i: any) => i.name).join(", ")}
                                    {order.items?.length > 2 && <span style={{ color: "#9A7A7A" }}> +{order.items.length - 2} more</span>}
                                </p>
                                {order.cancelReason && (
                                    <p style={{ margin: 0, fontSize: "0.72rem", color: "#EF4444" }}>
                                        ✕ {order.cancelReason}
                                        {order.cancelledBy && <span style={{ color: "#9A7A7A" }}> · by {order.cancelledBy}</span>}
                                    </p>
                                )}
                                <p style={{ margin: "4px 0 0", fontSize: "0.7rem", color: "#C0B0B0" }}>
                                    {new Date(order.createdAt).toLocaleDateString("en-NP", { day: "numeric", month: "short", year: "numeric" })}
                                </p>
                            </div>

                            {/* Right: amount + actions */}
                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                                <div style={{ fontWeight: 700, color: "#6B4E4E", fontSize: "0.95rem", marginBottom: 8 }}>
                                    Rs. {order.totalAmount?.toLocaleString()}
                                </div>
                                <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                                    <Link href={`/user/orders/${order._id}`} style={{
                                        fontSize: "0.72rem", padding: "4px 12px",
                                        border: "1.5px solid #E8D4D4", borderRadius: 100,
                                        color: "#6B4E4E", textDecoration: "none",
                                    }}>
                                        Details →
                                    </Link>
                                    {order.status === "pending" && (
                                        <button
                                            onClick={() => { setCancelModal({ id: order._id }); setCancelReason(""); }}
                                            style={{
                                                fontSize: "0.72rem", padding: "4px 12px",
                                                border: "1.5px solid #FCA5A5", borderRadius: 100,
                                                color: "#EF4444", background: "white",
                                                cursor: "pointer", fontFamily: "inherit",
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination + link to full page */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
                        style={{ padding: "5px 14px", borderRadius: 100, border: "1.5px solid #E8D4D4", background: "white", color: "#6B4E4E", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1, fontSize: "0.78rem", fontFamily: "inherit" }}>
                        ←
                    </button>
                    <span style={{ lineHeight: "30px", fontSize: "0.75rem", color: "#9A7A7A" }}>
                        {page} / {pagination.totalPages}
                    </span>
                    <button onClick={() => setPage(p => p + 1)} disabled={page === pagination.totalPages}
                        style={{ padding: "5px 14px", borderRadius: 100, border: "1.5px solid #E8D4D4", background: "white", color: "#6B4E4E", cursor: page === pagination.totalPages ? "not-allowed" : "pointer", opacity: page === pagination.totalPages ? 0.4 : 1, fontSize: "0.78rem", fontFamily: "inherit" }}>
                        →
                    </button>
                </div>
                <Link href="/user/orders" style={{
                    fontSize: "0.78rem", padding: "6px 16px",
                    background: "#6B4E4E", color: "white",
                    borderRadius: 100, textDecoration: "none",
                }}>
                    View All Orders →
                </Link>
            </div>

            {/* Cancel modal */}
            {cancelModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 16 }}>
                    <div style={{ background: "white", borderRadius: 16, padding: 28, maxWidth: 400, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
                        <h3 style={{ margin: "0 0 8px", color: "#6B4E4E", fontFamily: "Georgia, serif" }}>Cancel Order?</h3>
                        <p style={{ margin: "0 0 14px", color: "#9A7A7A", fontSize: "0.85rem" }}>Please give a reason for cancelling.</p>
                        <textarea
                            value={cancelReason}
                            onChange={e => setCancelReason(e.target.value)}
                            placeholder="e.g. Changed my mind"
                            rows={3}
                            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #E8D4D4", fontSize: "0.85rem", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", outline: "none" }}
                        />
                        <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "flex-end" }}>
                            <button onClick={() => setCancelModal(null)}
                                style={{ padding: "8px 18px", background: "white", border: "1.5px solid #E8D4D4", borderRadius: 100, cursor: "pointer", fontSize: "0.82rem", color: "#6B4E4E", fontFamily: "inherit" }}>
                                Keep Order
                            </button>
                            <button onClick={handleCancel} disabled={!cancelReason.trim() || !!cancellingId}
                                style={{ padding: "8px 18px", background: "#EF4444", color: "white", border: "none", borderRadius: 100, cursor: "pointer", fontSize: "0.82rem", fontFamily: "inherit", opacity: !cancelReason.trim() ? 0.5 : 1 }}>
                                {cancellingId ? "Cancelling…" : "Yes, Cancel"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}