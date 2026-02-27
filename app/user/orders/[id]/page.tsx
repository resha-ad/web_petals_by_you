// app/user/orders/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getMyOrderByIdAction, cancelMyOrderAction } from "@/lib/actions/order-action";

type OrderStatus = "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";

const STATUS_STEPS: OrderStatus[] = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"];

const STATUS_LABELS: Record<OrderStatus, string> = {
    pending: "Order Placed",
    confirmed: "Confirmed",
    preparing: "Preparing",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
};

const STATUS_ICONS: Record<OrderStatus, string> = {
    pending: "🕐",
    confirmed: "✅",
    preparing: "🌸",
    out_for_delivery: "🚚",
    delivered: "🎉",
    cancelled: "✕",
};

export default function UserOrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [data, setData] = useState<{ order: any; delivery: any } | null>(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        setLoading(true);
        const res = await getMyOrderByIdAction(id);
        if (res.success) setData(res.data);
        else setError(res.message || "Order not found");
        setLoading(false);
    };

    useEffect(() => { load(); }, [id]);

    const handleCancel = async () => {
        if (!cancelReason.trim()) return alert("Please provide a reason for cancellation.");
        setCancelling(true);
        const res = await cancelMyOrderAction(id, cancelReason);
        if (res.success) {
            setShowCancelModal(false);
            await load();
        } else {
            alert(res.message || "Failed to cancel order");
        }
        setCancelling(false);
    };

    if (loading) return (
        <div style={{ minHeight: "100vh", background: "#FBF6F4", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, color: "#9A7A7A" }}>
            <div style={{ fontSize: "2rem" }}>🌸</div>
            <p>Loading order…</p>
        </div>
    );

    if (error || !data) return (
        <div style={{ minHeight: "100vh", background: "#FBF6F4", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: "2rem" }}>🥀</div>
            <p style={{ color: "#9A7A7A" }}>{error || "Order not found"}</p>
            <Link href="/user/orders" style={{ color: "#6B4E4E", textDecoration: "none" }}>← Back to Orders</Link>
        </div>
    );

    const { order, delivery } = data;
    const isCancelled = order.status === "cancelled";
    const canCancel = order.status === "pending";
    const currentStepIdx = isCancelled ? -1 : STATUS_STEPS.indexOf(order.status);

    return (
        <div style={{ minHeight: "100vh", background: "#FBF6F4", padding: "32px 16px" }}>
            <div style={{ maxWidth: 760, margin: "0 auto" }}>

                {/* Back */}
                <Link href="/user/orders" style={{ fontSize: "0.8rem", color: "#9A7A7A", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 16 }}>
                    ← My Orders
                </Link>

                {/* Order header */}
                <div style={{ background: "white", borderRadius: 16, padding: "20px 24px", border: "1px solid #F3E6E6", marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                        <div>
                            <p style={{ fontSize: "0.72rem", color: "#9A7A7A", fontFamily: "monospace", margin: "0 0 4px" }}>
                                ORDER #{order._id.slice(-10).toUpperCase()}
                            </p>
                            <p style={{ fontSize: "0.8rem", color: "#9A7A7A", margin: 0 }}>
                                Placed {new Date(order.createdAt).toLocaleDateString("en-NP", { day: "numeric", month: "long", year: "numeric" })}
                            </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#6B4E4E" }}>Rs. {order.totalAmount?.toLocaleString()}</div>
                            <div style={{ fontSize: "0.75rem", color: "#9A7A7A", textTransform: "capitalize" }}>{order.paymentMethod?.replace(/_/g, " ")} · {order.paymentStatus}</div>
                        </div>
                    </div>

                    {/* Cancellation notice */}
                    {isCancelled && (
                        <div style={{ marginTop: 14, padding: "12px 16px", background: "#FEF2F2", borderRadius: 10, borderLeft: "3px solid #EF4444" }}>
                            <p style={{ margin: 0, fontWeight: 600, color: "#B91C1C", fontSize: "0.85rem" }}>
                                Order Cancelled {order.cancelledBy ? `by ${order.cancelledBy}` : ""}
                            </p>
                            {order.cancelReason && (
                                <p style={{ margin: "4px 0 0", color: "#7F1D1D", fontSize: "0.8rem" }}>
                                    Reason: {order.cancelReason}
                                </p>
                            )}
                        </div>
                    )}

                    {order.notes && (
                        <div style={{ marginTop: 12, padding: "10px 14px", background: "#FBF6F4", borderRadius: 8, fontSize: "0.8rem", color: "#7A6060" }}>
                            📝 Note: {order.notes}
                        </div>
                    )}
                </div>

                {/* Progress tracker */}
                {!isCancelled && (
                    <div style={{ background: "white", borderRadius: 16, padding: "20px 24px", border: "1px solid #F3E6E6", marginBottom: 16 }}>
                        <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#6B4E4E", margin: "0 0 18px" }}>Order Progress</h2>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
                            {/* Track line */}
                            <div style={{ position: "absolute", top: 18, left: "5%", right: "5%", height: 2, background: "#F3E6E6", zIndex: 0 }} />
                            <div style={{ position: "absolute", top: 18, left: "5%", width: `${Math.max(0, currentStepIdx / (STATUS_STEPS.length - 1)) * 90}%`, height: 2, background: "#E8B4B8", zIndex: 0, transition: "width 0.4s ease" }} />

                            {STATUS_STEPS.map((step, idx) => {
                                const done = idx <= currentStepIdx;
                                const active = idx === currentStepIdx;
                                return (
                                    <div key={step} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, zIndex: 1, flex: 1 }}>
                                        <div style={{
                                            width: 36, height: 36, borderRadius: "50%",
                                            background: done ? "#E8B4B8" : "#F3E6E6",
                                            border: active ? "3px solid #D9A3A7" : "2px solid transparent",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: "1rem", transition: "all 0.2s",
                                            boxShadow: active ? "0 0 0 4px rgba(232,180,184,0.2)" : "none",
                                        }}>
                                            {done ? STATUS_ICONS[step] : <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#C0A0A0" }} />}
                                        </div>
                                        <span style={{ fontSize: "0.65rem", color: done ? "#6B4E4E" : "#B0A0A0", fontWeight: done ? 600 : 400, textAlign: "center" }}>
                                            {STATUS_LABELS[step]}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Delivery tracking */}
                {delivery && (
                    <div style={{ background: "white", borderRadius: 16, padding: "20px 24px", border: "1px solid #F3E6E6", marginBottom: 16 }}>
                        <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#6B4E4E", margin: "0 0 14px", display: "flex", alignItems: "center", gap: 8 }}>
                            🚚 Delivery Details
                            <span style={{
                                fontSize: "0.68rem", padding: "2px 8px", borderRadius: 100,
                                background: delivery.status === "cancelled" ? "#FEE2E2" : delivery.status === "delivered" ? "#DCFCE7" : "#DBEAFE",
                                color: delivery.status === "cancelled" ? "#991B1B" : delivery.status === "delivered" ? "#166534" : "#1E40AF",
                                fontWeight: 600, textTransform: "capitalize",
                            }}>
                                {delivery.status?.replace(/_/g, " ")}
                            </span>
                        </h2>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px", marginBottom: 16, fontSize: "0.82rem", color: "#7A6060" }}>
                            <div><span style={{ color: "#9A7A7A" }}>Recipient:</span> {delivery.recipientName}</div>
                            <div><span style={{ color: "#9A7A7A" }}>Phone:</span> {delivery.recipientPhone}</div>
                            <div style={{ gridColumn: "1 / -1" }}>
                                <span style={{ color: "#9A7A7A" }}>Address:</span> {delivery.address?.street}, {delivery.address?.city}
                                {delivery.address?.state && `, ${delivery.address.state}`} · {delivery.address?.country}
                            </div>
                            {delivery.estimatedDelivery && (
                                <div><span style={{ color: "#9A7A7A" }}>Est. Delivery:</span> {new Date(delivery.estimatedDelivery).toLocaleDateString("en-NP", { day: "numeric", month: "short" })}</div>
                            )}
                            {delivery.deliveredAt && (
                                <div><span style={{ color: "#9A7A7A" }}>Delivered:</span> {new Date(delivery.deliveredAt).toLocaleString("en-NP")}</div>
                            )}
                        </div>

                        {/* Cancellation */}
                        {delivery.status === "cancelled" && delivery.cancelReason && (
                            <div style={{ padding: "10px 14px", background: "#FEF2F2", borderRadius: 8, marginBottom: 14, fontSize: "0.8rem", color: "#B91C1C" }}>
                                ✕ Delivery cancelled: {delivery.cancelReason}
                            </div>
                        )}

                        {/* Tracking updates */}
                        {delivery.trackingUpdates?.length > 0 && (
                            <div>
                                <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6B4E4E", marginBottom: 10 }}>Tracking Updates</p>
                                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                                    {[...delivery.trackingUpdates].reverse().map((update: any, idx: number) => (
                                        <div key={idx} style={{ display: "flex", gap: 12, paddingBottom: idx < delivery.trackingUpdates.length - 1 ? 12 : 0 }}>
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                <div style={{ width: 10, height: 10, borderRadius: "50%", background: idx === 0 ? "#E8B4B8" : "#E8DDD0", flexShrink: 0, marginTop: 3 }} />
                                                {idx < delivery.trackingUpdates.length - 1 && (
                                                    <div style={{ width: 1, flex: 1, background: "#F0E8E0", marginTop: 2 }} />
                                                )}
                                            </div>
                                            <div style={{ paddingBottom: 12 }}>
                                                <p style={{ margin: 0, fontSize: "0.82rem", color: "#6B4E4E" }}>{update.message}</p>
                                                <p style={{ margin: "2px 0 0", fontSize: "0.7rem", color: "#9A7A7A" }}>
                                                    {new Date(update.timestamp).toLocaleString("en-NP")}
                                                    {update.updatedBy && ` · ${update.updatedBy}`}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Items */}
                <div style={{ background: "white", borderRadius: 16, padding: "20px 24px", border: "1px solid #F3E6E6", marginBottom: 16 }}>
                    <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#6B4E4E", margin: "0 0 14px" }}>Items Ordered</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {order.items?.map((item: any, idx: number) => (
                            <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, borderBottom: idx < order.items.length - 1 ? "1px solid #F9F0EE" : "none" }}>
                                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                    {item.imageUrl ? (
                                        <img src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${item.imageUrl}`} alt={item.name} style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }} />
                                    ) : (
                                        <div style={{ width: 48, height: 48, borderRadius: 8, background: "#F3E6E6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
                                            {item.type === "custom" ? "🌸" : "🎁"}
                                        </div>
                                    )}
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 500, color: "#6B4E4E", fontSize: "0.875rem" }}>{item.name}</p>
                                        <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#9A7A7A", textTransform: "capitalize" }}>{item.type}</p>
                                    </div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <p style={{ margin: 0, fontWeight: 600, color: "#6B4E4E", fontSize: "0.875rem" }}>Rs. {item.subtotal?.toLocaleString()}</p>
                                    <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#9A7A7A" }}>×{item.quantity} · Rs. {item.unitPrice?.toLocaleString()} each</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16, paddingTop: 14, borderTop: "1.5px solid #F3E6E6" }}>
                        <div style={{ fontSize: "1rem", fontWeight: 700, color: "#6B4E4E" }}>
                            Total: Rs. {order.totalAmount?.toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Cancel button */}
                {canCancel && (
                    <div style={{ textAlign: "right" }}>
                        <button
                            onClick={() => setShowCancelModal(true)}
                            style={{ padding: "10px 22px", background: "white", color: "#EF4444", border: "1.5px solid #FCA5A5", borderRadius: 100, cursor: "pointer", fontSize: "0.85rem", fontWeight: 500 }}
                        >
                            Cancel Order
                        </button>
                    </div>
                )}
            </div>

            {/* Cancel modal */}
            {showCancelModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16 }}>
                    <div style={{ background: "white", borderRadius: 16, padding: 28, maxWidth: 420, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
                        <h3 style={{ margin: "0 0 8px", color: "#6B4E4E", fontSize: "1.1rem", fontFamily: "Georgia, serif" }}>Cancel Order?</h3>
                        <p style={{ margin: "0 0 16px", color: "#9A7A7A", fontSize: "0.85rem" }}>This action cannot be undone. Please tell us why you're cancelling.</p>
                        <textarea
                            value={cancelReason}
                            onChange={e => setCancelReason(e.target.value)}
                            placeholder="Reason for cancellation..."
                            rows={3}
                            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #E8D4D4", fontSize: "0.85rem", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", outline: "none" }}
                        />
                        <div style={{ display: "flex", gap: 10, marginTop: 16, justifyContent: "flex-end" }}>
                            <button onClick={() => setShowCancelModal(false)} style={{ padding: "9px 20px", background: "white", border: "1.5px solid #E8D4D4", borderRadius: 100, cursor: "pointer", fontSize: "0.85rem", color: "#6B4E4E" }}>
                                Keep Order
                            </button>
                            <button onClick={handleCancel} disabled={cancelling || !cancelReason.trim()} style={{ padding: "9px 20px", background: cancelling ? "#FCA5A5" : "#EF4444", color: "white", border: "none", borderRadius: 100, cursor: cancelling ? "not-allowed" : "pointer", fontSize: "0.85rem", fontWeight: 500 }}>
                                {cancelling ? "Cancelling…" : "Yes, Cancel"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}