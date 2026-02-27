// app/admin/orders/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    adminGetOrderByIdAction,
    adminUpdateOrderStatusAction,
    adminCancelOrderAction,
    adminGetDeliveryByOrderIdAction,
    adminCreateDeliveryAction,
} from "@/lib/actions/order-action";

// ─── Config ───────────────────────────────────────────────────────────────────

/**
 * Order pipeline (admin manually advances): pending → confirmed → preparing
 * After "preparing", admin creates/manages a delivery record.
 * Delivery service then drives: out_for_delivery → delivered
 */
const ORDER_PIPELINE = ["pending", "confirmed", "preparing"] as const;

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
    pending: { label: "Pending", color: "#92400E", bg: "#FEF3C7" },
    confirmed: { label: "Confirmed", color: "#1E40AF", bg: "#DBEAFE" },
    preparing: { label: "Preparing", color: "#5B21B6", bg: "#EDE9FE" },
    out_for_delivery: { label: "Out for Delivery", color: "#065F46", bg: "#D1FAE5" },
    delivered: { label: "Delivered", color: "#166534", bg: "#DCFCE7" },
    cancelled: { label: "Cancelled", color: "#991B1B", bg: "#FEE2E2" },
};

// What status comes next (manual admin advancement — stops at preparing)
const NEXT_STATUS: Record<string, string | null> = {
    pending: "confirmed",
    confirmed: "preparing",
    preparing: null,        // no manual next — delivery handles the rest
    out_for_delivery: null,
    delivered: null,
    cancelled: null,
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const Icons = {
    truck: (
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
    ),
    check: (
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
    ),
    x: (
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
    arrow: (
        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
    ),
    user: (
        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
    ),
    box: (
        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
        </svg>
    ),
};

// ─── Status Pipeline ─────────────────────────────────────────────────────────

function OrderPipeline({ status }: { status: string }) {
    const isCancelled = status === "cancelled";
    // For display, include out_for_delivery and delivered as "downstream" steps
    const fullPipeline = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"];
    const currentIdx = fullPipeline.indexOf(status);

    if (isCancelled) {
        return (
            <div style={{ padding: "12px 16px", background: "#FEF2F2", borderRadius: 10, borderLeft: "3px solid #EF4444" }}>
                <p style={{ margin: 0, fontWeight: 600, color: "#B91C1C", fontSize: "0.85rem" }}>
                    Order Cancelled
                </p>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", position: "relative", marginBottom: 4 }}>
            <div style={{ position: "absolute", top: 14, left: "5%", right: "5%", height: 2, background: "#F3E6E6", zIndex: 0 }} />
            <div style={{
                position: "absolute", top: 14, left: "5%",
                width: `${Math.max(0, currentIdx / (fullPipeline.length - 1)) * 90}%`,
                height: 2, background: "#6B4E4E", zIndex: 0, transition: "width 0.4s ease",
            }} />
            {fullPipeline.map((s, i) => {
                const done = i <= currentIdx;
                const active = i === currentIdx;
                const meta = STATUS_META[s];
                // Steps after "preparing" are delivery-driven — show them slightly dimmed
                const isDeliveryStep = i > 2;
                return (
                    <div key={s} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, zIndex: 1 }}>
                        <div style={{
                            width: 28, height: 28, borderRadius: "50%",
                            background: done ? "#6B4E4E" : isDeliveryStep ? "#EDE9FE" : "#F3E6E6",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: active ? "0 0 0 4px rgba(107,78,78,0.15)" : "none",
                            transition: "all 0.2s",
                            border: isDeliveryStep && !done ? "1.5px dashed #C4B4E4" : "none",
                        }}>
                            {done && i < currentIdx
                                ? <svg width="11" height="11" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                : active
                                    ? <div style={{ width: 8, height: 8, borderRadius: "50%", background: "white" }} />
                                    : <div style={{ width: 7, height: 7, borderRadius: "50%", background: isDeliveryStep ? "#C4B4E4" : "#D0C0C0" }} />
                            }
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <span style={{
                                fontSize: "0.58rem", color: done ? "#6B4E4E" : "#B0A0A0",
                                fontWeight: active ? 700 : done ? 500 : 400, display: "block",
                            }}>
                                {meta?.label}
                            </span>
                            {isDeliveryStep && !done && (
                                <span style={{ fontSize: "0.52rem", color: "#C4B4E4", display: "block" }}>via delivery</span>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner() {
    return (
        <span style={{
            width: 12, height: 12, border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "white",
            borderRadius: "50%", animation: "spin 0.6s linear infinite", display: "inline-block", flexShrink: 0,
        }} />
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminOrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<any>(null);
    const [delivery, setDelivery] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Cancel modal
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState("");

    // Delivery create form
    const [showDeliveryForm, setShowDeliveryForm] = useState(false);
    const [deliveryForm, setDeliveryForm] = useState({
        recipientName: "", recipientPhone: "",
        street: "", city: "", state: "", zip: "", country: "Nepal",
        scheduledDate: "", estimatedDelivery: "", deliveryNotes: "",
    });
    const [deliveryErrors, setDeliveryErrors] = useState<Record<string, string>>({});

    const showMsg = (type: "success" | "error", text: string) => {
        setStatusMsg({ type, text });
        setTimeout(() => setStatusMsg(null), 4500);
    };

    const load = async () => {
        setLoading(true);
        const orderRes = await adminGetOrderByIdAction(id);
        if (orderRes.success) setOrder(orderRes.data);

        try {
            const deliveryRes = await adminGetDeliveryByOrderIdAction(id);
            if (deliveryRes.success) setDelivery(deliveryRes.data);
            else setDelivery(null);
        } catch {
            setDelivery(null);
        }
        setLoading(false);
    };

    useEffect(() => { load(); }, [id]);

    // ── Advance status ────────────────────────────────────────────────────
    const handleStatusUpdate = async (newStatus: string) => {
        setActionLoading(true);
        setStatusMsg(null);
        const res = await adminUpdateOrderStatusAction(id, newStatus);
        if (res.success) {
            showMsg("success", `Status updated to "${STATUS_META[newStatus]?.label}"`);
            await load();
        } else {
            showMsg("error", res.message || "Failed to update status");
        }
        setActionLoading(false);
    };

    // ── Cancel order ──────────────────────────────────────────────────────
    const handleCancel = async () => {
        if (!cancelReason.trim()) return;
        setActionLoading(true);
        const res = await adminCancelOrderAction(id, cancelReason.trim());
        if (res.success) {
            setShowCancelModal(false);
            setCancelReason("");
            showMsg("success", "Order cancelled.");
            await load();
        } else {
            showMsg("error", res.message || "Failed to cancel");
        }
        setActionLoading(false);
    };

    // ── Delivery form validation ──────────────────────────────────────────
    const validateDelivery = () => {
        const errs: Record<string, string> = {};
        if (!deliveryForm.recipientName.trim()) errs.recipientName = "Required";
        else if (/^\d+$/.test(deliveryForm.recipientName.trim())) errs.recipientName = "Name cannot be only numbers";
        if (!deliveryForm.recipientPhone.trim()) errs.recipientPhone = "Required";
        else if (!/^(\+977)?[0-9]{9,10}$/.test(deliveryForm.recipientPhone.replace(/\s/g, "")))
            errs.recipientPhone = "Invalid phone number";
        if (!deliveryForm.street.trim()) errs.street = "Required";
        if (!deliveryForm.city.trim()) errs.city = "Required";
        else if (/^\d+$/.test(deliveryForm.city.trim())) errs.city = "City cannot be only numbers";
        setDeliveryErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleCreateDelivery = async () => {
        if (!validateDelivery()) return;
        setActionLoading(true);
        const res = await adminCreateDeliveryAction({
            orderId: id,
            recipientName: deliveryForm.recipientName,
            recipientPhone: deliveryForm.recipientPhone,
            address: {
                street: deliveryForm.street,
                city: deliveryForm.city,
                state: deliveryForm.state || undefined,
                zip: deliveryForm.zip || undefined,
                country: "Nepal",
            },
            scheduledDate: deliveryForm.scheduledDate || undefined,
            estimatedDelivery: deliveryForm.estimatedDelivery || undefined,
            deliveryNotes: deliveryForm.deliveryNotes || undefined,
        });
        if (res.success) {
            setShowDeliveryForm(false);
            showMsg("success", "Delivery created successfully.");
            await load();
        } else {
            showMsg("error", res.message || "Failed to create delivery");
        }
        setActionLoading(false);
    };

    // ── Render guards ─────────────────────────────────────────────────────

    if (loading) return (
        <div style={{ padding: 60, textAlign: "center", color: "#9A7A7A" }}>
            <div style={{ width: 28, height: 28, border: "3px solid #F3E6E6", borderTopColor: "#6B4E4E", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 12px" }} />
            Loading order…
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    if (!order) return (
        <div style={{ padding: 60, textAlign: "center", color: "#9A7A7A" }}>
            Order not found.{" "}
            <Link href="/admin/orders" style={{ color: "#6B4E4E", textDecoration: "none" }}>← Back</Link>
        </div>
    );

    const isCancelled = order.status === "cancelled";
    const isDelivered = order.status === "delivered";
    const isOutForDelivery = order.status === "out_for_delivery";
    const canCancel = !isCancelled && !isDelivered;
    const nextStatus = NEXT_STATUS[order.status];
    const statusMeta = STATUS_META[order.status] ?? STATUS_META.pending;

    // Show "create delivery" prompt when order is preparing and no delivery exists yet
    const showCreateDeliveryPrompt = order.status === "preparing" && !delivery && !isCancelled;

    const inp = (err?: string): React.CSSProperties => ({
        width: "100%", padding: "8px 10px", border: `1.5px solid ${err ? "#FCA5A5" : "#E8D4D4"}`,
        borderRadius: 8, fontSize: "0.82rem", fontFamily: "inherit",
        boxSizing: "border-box", outline: "none", background: "white",
    });
    const lbl: React.CSSProperties = {
        fontSize: "0.68rem", fontWeight: 600, color: "#9A7A7A",
        display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em",
    };

    return (
        <div style={{ padding: "24px", maxWidth: 960, margin: "0 auto" }}>

            {/* Back */}
            <Link href="/admin/orders" style={{ fontSize: "0.78rem", color: "#9A7A7A", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 14 }}>
                ← All Orders
            </Link>

            {/* Title row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
                <div>
                    <h1 style={{ fontFamily: "Georgia, serif", color: "#6B4E4E", fontSize: "1.4rem", margin: "0 0 4px" }}>
                        Order #{order._id.slice(-10).toUpperCase()}
                    </h1>
                    <p style={{ color: "#9A7A7A", fontSize: "0.78rem", margin: 0 }}>
                        {new Date(order.createdAt).toLocaleString("en-NP")} · {order.paymentMethod?.replace(/_/g, " ")}
                    </p>
                </div>
                <span style={{
                    padding: "5px 14px", borderRadius: 100, fontSize: "0.78rem", fontWeight: 600,
                    background: statusMeta.bg, color: statusMeta.color,
                }}>
                    {statusMeta.label}
                </span>
            </div>

            {/* Feedback */}
            {statusMsg && (
                <div style={{
                    marginBottom: 16, padding: "10px 16px", borderRadius: 10,
                    background: statusMsg.type === "success" ? "#DCFCE7" : "#FEE2E2",
                    color: statusMsg.type === "success" ? "#166534" : "#B91C1C",
                    fontSize: "0.82rem", display: "flex", alignItems: "center", gap: 8,
                }}>
                    {statusMsg.type === "success" ? Icons.check : Icons.x}
                    {statusMsg.text}
                </div>
            )}

            {/* ── Status pipeline + actions ── */}
            <div style={{ background: "white", borderRadius: 14, padding: "20px 24px", border: "1px solid #F3E6E6", marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                    <h3 style={{ margin: 0, fontSize: "0.85rem", fontWeight: 600, color: "#6B4E4E" }}>Order Status</h3>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {/* Advance to next status (only pending → confirmed → preparing) */}
                        {nextStatus && (
                            <button
                                onClick={() => handleStatusUpdate(nextStatus)}
                                disabled={actionLoading}
                                style={{
                                    display: "inline-flex", alignItems: "center", gap: 6,
                                    padding: "8px 18px", background: "#6B4E4E", color: "white",
                                    border: "none", borderRadius: 100, cursor: actionLoading ? "not-allowed" : "pointer",
                                    fontSize: "0.82rem", fontWeight: 600, fontFamily: "inherit",
                                    opacity: actionLoading ? 0.6 : 1,
                                    boxShadow: "0 2px 8px rgba(107,78,78,0.25)",
                                }}
                            >
                                {actionLoading ? <Spinner /> : Icons.arrow}
                                Mark as {STATUS_META[nextStatus]?.label}
                            </button>
                        )}
                        {/* Cancel */}
                        {canCancel && (
                            <button
                                onClick={() => setShowCancelModal(true)}
                                disabled={actionLoading}
                                style={{
                                    padding: "8px 16px", background: "white", color: "#EF4444",
                                    border: "1.5px solid #FCA5A5", borderRadius: 100,
                                    cursor: "pointer", fontSize: "0.82rem", fontFamily: "inherit",
                                }}
                            >
                                Cancel Order
                            </button>
                        )}
                    </div>
                </div>

                <OrderPipeline status={order.status} />

                {/* Context hint for "preparing" stage */}
                {order.status === "preparing" && (
                    <div style={{ marginTop: 14, padding: "10px 14px", background: "#EDE9FE", borderRadius: 8, fontSize: "0.8rem", color: "#5B21B6", display: "flex", alignItems: "center", gap: 8 }}>
                        {Icons.truck}
                        Order is ready — create a delivery record below to dispatch it.
                        The order will automatically advance to "Out for Delivery" when the delivery is marked in transit.
                    </div>
                )}

                {(isOutForDelivery || isDelivered) && (
                    <div style={{ marginTop: 14, padding: "10px 14px", background: isDelivered ? "#DCFCE7" : "#D1FAE5", borderRadius: 8, fontSize: "0.8rem", color: isDelivered ? "#166534" : "#065F46", display: "flex", alignItems: "center", gap: 8 }}>
                        {Icons.check}
                        {isDelivered
                            ? "Order has been delivered. Manage the delivery record for full tracking details."
                            : "Order is out for delivery. Manage the delivery record below to track progress."}
                    </div>
                )}

                {order.notes && (
                    <div style={{ marginTop: 14, padding: "8px 12px", background: "#FBF6F4", borderRadius: 8, fontSize: "0.8rem", color: "#7A6060" }}>
                        Note: {order.notes}
                    </div>
                )}
            </div>

            {/* ── Two-column: customer + payment ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                {/* Customer */}
                <div style={{ background: "white", borderRadius: 14, padding: "18px 20px", border: "1px solid #F3E6E6" }}>
                    <h3 style={{ margin: "0 0 12px", fontSize: "0.85rem", fontWeight: 600, color: "#6B4E4E", display: "flex", alignItems: "center", gap: 6 }}>
                        {Icons.user} Customer
                    </h3>
                    <div style={{ fontSize: "0.82rem", color: "#7A6060", display: "flex", flexDirection: "column", gap: 4 }}>
                        <p style={{ margin: 0, fontWeight: 600, color: "#6B4E4E" }}>
                            {order.userId?.firstName || ""} {order.userId?.lastName || ""}
                        </p>
                        <p style={{ margin: 0 }}>{order.userId?.email || "—"}</p>
                        <p style={{ margin: "4px 0 0", fontFamily: "monospace", fontSize: "0.68rem", color: "#C0A090" }}>
                            ID: {order.userId?._id || "—"}
                        </p>
                    </div>
                </div>

                {/* Payment */}
                <div style={{ background: "white", borderRadius: 14, padding: "18px 20px", border: "1px solid #F3E6E6" }}>
                    <h3 style={{ margin: "0 0 12px", fontSize: "0.85rem", fontWeight: 600, color: "#6B4E4E" }}>Payment</h3>
                    <div style={{ fontSize: "0.82rem", display: "flex", flexDirection: "column", gap: 6 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#9A7A7A" }}>Method</span>
                            <span style={{ color: "#6B4E4E", fontWeight: 500, textTransform: "capitalize" }}>
                                {order.paymentMethod?.replace(/_/g, " ") || "—"}
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#9A7A7A" }}>Status</span>
                            <span style={{ fontWeight: 600, color: order.paymentStatus === "paid" ? "#166534" : "#92400E", textTransform: "capitalize" }}>
                                {order.paymentStatus || "—"}
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid #F3E6E6" }}>
                            <span style={{ color: "#9A7A7A" }}>Total</span>
                            <span style={{ fontWeight: 700, color: "#6B4E4E", fontSize: "1rem" }}>
                                Rs. {order.totalAmount?.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Items ── */}
            <div style={{ background: "white", borderRadius: 14, padding: "18px 20px", border: "1px solid #F3E6E6", marginBottom: 16 }}>
                <h3 style={{ margin: "0 0 14px", fontSize: "0.85rem", fontWeight: 600, color: "#6B4E4E", display: "flex", alignItems: "center", gap: 6 }}>
                    {Icons.box} Items ({order.items?.length || 0})
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {order.items?.map((item: any, idx: number) => (
                        <div key={idx} style={{
                            display: "flex", gap: 12, alignItems: "center",
                            paddingBottom: 10, borderBottom: idx < order.items.length - 1 ? "1px solid #F9F0EE" : "none",
                        }}>
                            {item.imageUrl ? (
                                <img src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${item.imageUrl}`} alt={item.name}
                                    style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                            ) : (
                                <div style={{ width: 44, height: 44, borderRadius: 8, background: "#F3E6E6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <svg width="18" height="18" fill="none" stroke="#C4A0A0" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
                                    </svg>
                                </div>
                            )}
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 500, color: "#6B4E4E" }}>{item.name}</p>
                                <p style={{ margin: "2px 0 0", fontSize: "0.72rem", color: "#9A7A7A", textTransform: "capitalize" }}>
                                    {item.type} · ×{item.quantity} · Rs. {item.unitPrice?.toLocaleString()} each
                                </p>
                            </div>
                            <p style={{ margin: 0, fontWeight: 600, color: "#6B4E4E", fontSize: "0.85rem" }}>
                                Rs. {item.subtotal?.toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1.5px solid #F3E6E6", display: "flex", justifyContent: "flex-end" }}>
                    <span style={{ fontWeight: 700, color: "#6B4E4E" }}>Total: Rs. {order.totalAmount?.toLocaleString()}</span>
                </div>
            </div>

            {/* ── Delivery section ── */}
            <div style={{ background: "white", borderRadius: 14, padding: "18px 20px", border: "1px solid #F3E6E6" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <h3 style={{ margin: 0, fontSize: "0.85rem", fontWeight: 600, color: "#6B4E4E", display: "flex", alignItems: "center", gap: 6 }}>
                        {Icons.truck} Delivery
                    </h3>
                    <div style={{ display: "flex", gap: 8 }}>
                        {!delivery && !isCancelled && !showDeliveryForm && (
                            <button
                                onClick={() => setShowDeliveryForm(true)}
                                style={{
                                    padding: "6px 16px", background: "#6B4E4E", color: "white",
                                    border: "none", borderRadius: 100, cursor: "pointer",
                                    fontSize: "0.78rem", fontFamily: "inherit",
                                }}
                            >
                                + Create Delivery
                            </button>
                        )}
                        {delivery && (
                            <Link
                                href={`/admin/deliveries/${delivery._id}`}
                                style={{
                                    fontSize: "0.78rem", color: "#6B4E4E", textDecoration: "none",
                                    padding: "5px 14px", border: "1.5px solid #E8D4D4", borderRadius: 100,
                                }}
                            >
                                Manage Delivery →
                            </Link>
                        )}
                    </div>
                </div>

                {/* Prompt to create delivery when preparing */}
                {showCreateDeliveryPrompt && !showDeliveryForm && (
                    <div style={{ padding: "14px 16px", background: "#FBF6F4", borderRadius: 10, border: "1px dashed #E8D4D4", textAlign: "center" }}>
                        <p style={{ margin: "0 0 10px", fontSize: "0.82rem", color: "#9A7A7A" }}>
                            Order is ready to ship. Create a delivery record to dispatch it.
                        </p>
                        <button
                            onClick={() => setShowDeliveryForm(true)}
                            style={{
                                padding: "8px 20px", background: "#6B4E4E", color: "white",
                                border: "none", borderRadius: 100, cursor: "pointer",
                                fontSize: "0.82rem", fontFamily: "inherit",
                            }}
                        >
                            Create Delivery Record
                        </button>
                    </div>
                )}

                {!delivery && !showDeliveryForm && !showCreateDeliveryPrompt && (
                    <p style={{ color: "#9A7A7A", fontSize: "0.82rem", margin: 0 }}>
                        No delivery record yet.{!isCancelled && " Create one above."}
                    </p>
                )}

                {/* Delivery summary (if exists) */}
                {delivery && !showDeliveryForm && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px 20px", fontSize: "0.82rem", color: "#7A6060" }}>
                        <div>
                            <span style={{ fontSize: "0.68rem", color: "#9A7A7A", display: "block", marginBottom: 2, textTransform: "uppercase" }}>Status</span>
                            <span style={{
                                fontWeight: 600, textTransform: "capitalize",
                                color: delivery.status === "delivered" ? "#166534" : delivery.status === "cancelled" ? "#991B1B" : "#6B4E4E",
                            }}>
                                {delivery.status?.replace(/_/g, " ")}
                            </span>
                        </div>
                        <div>
                            <span style={{ fontSize: "0.68rem", color: "#9A7A7A", display: "block", marginBottom: 2, textTransform: "uppercase" }}>Recipient</span>
                            {delivery.recipientName}
                        </div>
                        <div>
                            <span style={{ fontSize: "0.68rem", color: "#9A7A7A", display: "block", marginBottom: 2, textTransform: "uppercase" }}>Phone</span>
                            {delivery.recipientPhone}
                        </div>
                        <div style={{ gridColumn: "1 / -1" }}>
                            <span style={{ fontSize: "0.68rem", color: "#9A7A7A", display: "block", marginBottom: 2, textTransform: "uppercase" }}>Address</span>
                            {delivery.address?.street}, {delivery.address?.city}
                            {delivery.address?.state && `, ${delivery.address.state}`}, {delivery.address?.country}
                        </div>
                        {delivery.estimatedDelivery && (
                            <div>
                                <span style={{ fontSize: "0.68rem", color: "#9A7A7A", display: "block", marginBottom: 2, textTransform: "uppercase" }}>Est. Delivery</span>
                                {new Date(delivery.estimatedDelivery).toLocaleDateString()}
                            </div>
                        )}
                    </div>
                )}

                {/* Create delivery form */}
                {showDeliveryForm && (
                    <div style={{ background: "#FBF6F4", borderRadius: 12, padding: 16 }}>
                        <h4 style={{ margin: "0 0 14px", color: "#6B4E4E", fontSize: "0.875rem" }}>New Delivery Record</h4>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                            {[
                                { label: "Recipient Name *", key: "recipientName", placeholder: "Full name" },
                                { label: "Phone *", key: "recipientPhone", placeholder: "98XXXXXXXX" },
                                { label: "Street *", key: "street", placeholder: "Street, tole..." },
                                { label: "City *", key: "city", placeholder: "Kathmandu" },
                                { label: "State", key: "state", placeholder: "Bagmati" },
                                { label: "ZIP", key: "zip", placeholder: "44600" },
                                { label: "Scheduled Date", key: "scheduledDate", type: "date" },
                                { label: "Est. Delivery Date", key: "estimatedDelivery", type: "date" },
                            ].map(({ label, key, type, placeholder }) => (
                                <div key={key}>
                                    <label style={lbl}>{label}</label>
                                    <input
                                        type={type || "text"}
                                        placeholder={placeholder}
                                        value={(deliveryForm as any)[key]}
                                        onChange={e => {
                                            setDeliveryForm(f => ({ ...f, [key]: e.target.value }));
                                            setDeliveryErrors(er => ({ ...er, [key]: "" }));
                                        }}
                                        style={inp(deliveryErrors[key])}
                                    />
                                    {deliveryErrors[key] && (
                                        <p style={{ margin: "2px 0 0", fontSize: "0.68rem", color: "#EF4444" }}>{deliveryErrors[key]}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div style={{ marginBottom: 12 }}>
                            <label style={lbl}>Delivery Notes</label>
                            <textarea
                                value={deliveryForm.deliveryNotes}
                                onChange={e => setDeliveryForm(f => ({ ...f, deliveryNotes: e.target.value }))}
                                rows={2}
                                placeholder="Driver instructions, special handling..."
                                style={{ ...inp(), resize: "vertical" }}
                            />
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                            <button
                                onClick={handleCreateDelivery}
                                disabled={actionLoading}
                                style={{
                                    padding: "8px 20px", background: "#6B4E4E", color: "white",
                                    border: "none", borderRadius: 100, cursor: "pointer",
                                    fontSize: "0.82rem", fontFamily: "inherit",
                                    opacity: actionLoading ? 0.6 : 1,
                                    display: "flex", alignItems: "center", gap: 6,
                                }}
                            >
                                {actionLoading ? <><Spinner /> Creating…</> : "Create Delivery"}
                            </button>
                            <button
                                onClick={() => { setShowDeliveryForm(false); setDeliveryErrors({}); }}
                                style={{
                                    padding: "8px 16px", background: "white", color: "#6B4E4E",
                                    border: "1.5px solid #E8D4D4", borderRadius: 100,
                                    cursor: "pointer", fontSize: "0.82rem", fontFamily: "inherit",
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Cancel modal ── */}
            {showCancelModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
                    <div style={{ background: "white", borderRadius: 16, padding: 28, maxWidth: 420, width: "100%", boxShadow: "0 24px 60px rgba(0,0,0,0.15)" }}>
                        <h3 style={{ margin: "0 0 8px", color: "#6B4E4E", fontFamily: "Georgia, serif", fontSize: "1.1rem" }}>Cancel Order?</h3>
                        <p style={{ margin: "0 0 14px", color: "#9A7A7A", fontSize: "0.85rem" }}>
                            This reason will be shown to the customer. Any linked delivery will also be cancelled.
                        </p>
                        <textarea
                            value={cancelReason}
                            onChange={e => setCancelReason(e.target.value)}
                            placeholder="e.g. Item out of stock, unable to fulfil"
                            rows={3}
                            autoFocus
                            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #E8D4D4", fontSize: "0.85rem", fontFamily: "inherit", boxSizing: "border-box", outline: "none", resize: "vertical" }}
                        />
                        <div style={{ display: "flex", gap: 10, marginTop: 16, justifyContent: "flex-end" }}>
                            <button
                                onClick={() => { setShowCancelModal(false); setCancelReason(""); }}
                                style={{ padding: "9px 20px", background: "white", border: "1.5px solid #E8D4D4", borderRadius: 100, cursor: "pointer", fontSize: "0.82rem", color: "#6B4E4E", fontFamily: "inherit" }}
                            >
                                Keep Order
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={actionLoading || !cancelReason.trim()}
                                style={{ padding: "9px 20px", background: "#EF4444", color: "white", border: "none", borderRadius: 100, cursor: !cancelReason.trim() ? "not-allowed" : "pointer", fontSize: "0.82rem", fontFamily: "inherit", opacity: !cancelReason.trim() ? 0.5 : 1 }}
                            >
                                {actionLoading ? "Cancelling…" : "Confirm Cancel"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}