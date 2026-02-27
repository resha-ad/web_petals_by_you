// app/admin/deliveries/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    adminUpdateDeliveryAction,
    adminAddTrackingUpdateAction,
    adminCancelDeliveryAction,
    adminGetDeliveryByIdAction,
} from "@/lib/actions/order-action";

// ─── Config ───────────────────────────────────────────────────────────────────

const DELIVERY_STATUSES = [
    { value: "pending", label: "Pending" },
    { value: "assigned", label: "Assigned" },
    { value: "in_transit", label: "In Transit" },
    { value: "delivered", label: "Delivered" },
    { value: "failed", label: "Failed" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
    pending: { label: "Pending", color: "#92400E", bg: "#FEF3C7", dot: "#F59E0B" },
    assigned: { label: "Assigned", color: "#1E40AF", bg: "#DBEAFE", dot: "#3B82F6" },
    in_transit: { label: "In Transit", color: "#5B21B6", bg: "#EDE9FE", dot: "#8B5CF6" },
    delivered: { label: "Delivered", color: "#166534", bg: "#DCFCE7", dot: "#22C55E" },
    failed: { label: "Failed", color: "#991B1B", bg: "#FEE2E2", dot: "#EF4444" },
    cancelled: { label: "Cancelled", color: "#6B7280", bg: "#F3F4F6", dot: "#9CA3AF" },
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const Ico = {
    truck: (
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
    ),
    user: (
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
    ),
    pin: (
        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
    ),
    clock: (
        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
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
    plus: (
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
    ),
    note: (
        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z" />
        </svg>
    ),
    link: (
        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
        </svg>
    ),
};

// ─── Feedback banner ──────────────────────────────────────────────────────────

function FeedbackBanner({ msg }: { msg: { type: "success" | "error"; text: string } | null }) {
    if (!msg) return null;
    return (
        <div style={{
            marginBottom: 16, padding: "10px 16px", borderRadius: 10,
            background: msg.type === "success" ? "#DCFCE7" : "#FEE2E2",
            color: msg.type === "success" ? "#166534" : "#B91C1C",
            fontSize: "0.82rem", display: "flex", alignItems: "center", gap: 8,
        }}>
            <span style={{ color: msg.type === "success" ? "#166534" : "#B91C1C" }}>
                {msg.type === "success" ? Ico.check : Ico.x}
            </span>
            {msg.text}
        </div>
    );
}

// ─── Delivery status pipeline ──────────────────────────────────────────────────

const PIPELINE = ["pending", "assigned", "in_transit", "delivered"];

function DeliveryPipeline({ status }: { status: string }) {
    const idx = PIPELINE.indexOf(status);
    const isBad = status === "failed" || status === "cancelled";
    return (
        <div style={{ display: "flex", alignItems: "flex-start", position: "relative", justifyContent: "space-between" }}>
            <div style={{ position: "absolute", top: 13, left: "6%", right: "6%", height: 2, background: "#F3E6E6", zIndex: 0 }} />
            {!isBad && idx >= 0 && (
                <div style={{
                    position: "absolute", top: 13, left: "6%",
                    width: `${(idx / (PIPELINE.length - 1)) * 88}%`,
                    height: 2, background: "#6B4E4E", zIndex: 0, transition: "width 0.4s",
                }} />
            )}
            {PIPELINE.map((s, i) => {
                const done = !isBad && i <= idx;
                const active = !isBad && i === idx;
                const cfg = STATUS_CONFIG[s];
                return (
                    <div key={s} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, zIndex: 1 }}>
                        <div style={{
                            width: 26, height: 26, borderRadius: "50%",
                            background: done ? "#6B4E4E" : "#F3E6E6",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: active ? "0 0 0 4px rgba(107,78,78,0.12)" : "none",
                            transition: "all 0.2s",
                        }}>
                            {done && i < idx
                                ? <svg width="10" height="10" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                : active
                                    ? <div style={{ width: 8, height: 8, borderRadius: "50%", background: "white" }} />
                                    : <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#D0C0C0" }} />
                            }
                        </div>
                        <span style={{ fontSize: "0.58rem", color: done ? "#6B4E4E" : "#B0A0A0", fontWeight: active ? 700 : done ? 500 : 400, textAlign: "center" }}>
                            {cfg.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminDeliveryDetailPage() {
    const { id } = useParams<{ id: string }>();

    const [delivery, setDelivery] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [addingTrack, setAddingTrack] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Editable fields
    const [editStatus, setEditStatus] = useState("");
    const [editEst, setEditEst] = useState("");
    const [editNotes, setEditNotes] = useState("");
    const [trackingMsg, setTrackingMsg] = useState("");

    // Cancel modal
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState("");

    const showMsg = (type: "success" | "error", text: string) => {
        setMsg({ type, text });
        setTimeout(() => setMsg(null), 4500);
    };

    const load = async () => {
        setLoading(true);
        const res = await adminGetDeliveryByIdAction(id);
        if (res.success && res.data) {
            const d = res.data;
            setDelivery(d);
            setEditStatus(d.status);
            setEditNotes(d.deliveryNotes || "");
            setEditEst(d.estimatedDelivery ? d.estimatedDelivery.split("T")[0] : "");
        }
        setLoading(false);
    };

    useEffect(() => { load(); }, [id]);

    // ── Update status / est date / notes ─────────────────────────────────
    const handleSaveChanges = async () => {
        setSaving(true);
        const payload: any = {};
        if (editStatus !== delivery.status) payload.status = editStatus;
        if (editNotes !== (delivery.deliveryNotes || "")) payload.deliveryNotes = editNotes;
        const estRaw = editEst ? new Date(editEst).toISOString() : null;
        const currentEst = delivery.estimatedDelivery ? delivery.estimatedDelivery.split("T")[0] : "";
        if (editEst !== currentEst) payload.estimatedDelivery = estRaw;

        if (Object.keys(payload).length === 0) {
            showMsg("error", "No changes to save.");
            setSaving(false);
            return;
        }

        const res = await adminUpdateDeliveryAction(id, payload);
        if (res.success) {
            showMsg("success", "Delivery updated successfully.");
            await load();
        } else {
            showMsg("error", res.message || "Failed to update delivery.");
        }
        setSaving(false);
    };

    // ── Add tracking update ───────────────────────────────────────────────
    const handleAddTracking = async () => {
        if (!trackingMsg.trim()) return;
        setAddingTrack(true);
        const res = await adminAddTrackingUpdateAction(id, trackingMsg.trim());
        if (res.success) {
            setTrackingMsg("");
            showMsg("success", "Tracking update added.");
            await load();
        } else {
            showMsg("error", res.message || "Failed to add tracking update.");
        }
        setAddingTrack(false);
    };

    // ── Cancel delivery ───────────────────────────────────────────────────
    const handleCancel = async () => {
        if (!cancelReason.trim()) return;
        setCancelling(true);
        const res = await adminCancelDeliveryAction(id, cancelReason.trim());
        if (res.success) {
            setShowCancelModal(false);
            setCancelReason("");
            showMsg("success", "Delivery cancelled.");
            await load();
        } else {
            showMsg("error", res.message || "Failed to cancel delivery.");
        }
        setCancelling(false);
    };

    // ── Render guards ─────────────────────────────────────────────────────

    if (loading) return (
        <div style={{ padding: 60, textAlign: "center", color: "#9A7A7A" }}>
            <div style={{ width: 28, height: 28, border: "3px solid #F3E6E6", borderTopColor: "#6B4E4E", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 12px" }} />
            Loading delivery…
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    if (!delivery) return (
        <div style={{ padding: 60, textAlign: "center", color: "#9A7A7A" }}>
            Delivery not found.{" "}
            <Link href="/admin/deliveries" style={{ color: "#6B4E4E", textDecoration: "none" }}>← Back</Link>
        </div>
    );

    const isCancelled = delivery.status === "cancelled";
    const isDelivered = delivery.status === "delivered";
    const isFailed = delivery.status === "failed";
    const canEdit = !isCancelled && !isDelivered;
    const cfg = STATUS_CONFIG[delivery.status] ?? STATUS_CONFIG.pending;
    const orderId = delivery.orderId?._id ?? delivery.orderId;

    const inp: React.CSSProperties = {
        width: "100%", padding: "9px 11px", border: "1.5px solid #E8D4D4",
        borderRadius: 8, fontSize: "0.82rem", fontFamily: "inherit",
        boxSizing: "border-box", outline: "none", background: "white",
    };
    const lbl: React.CSSProperties = {
        fontSize: "0.68rem", fontWeight: 600, color: "#9A7A7A",
        display: "block", marginBottom: 4,
        textTransform: "uppercase", letterSpacing: "0.05em",
    };

    return (
        <div style={{ padding: "24px", maxWidth: 960, margin: "0 auto" }}>

            {/* Back nav */}
            <Link href="/admin/deliveries" style={{ fontSize: "0.78rem", color: "#9A7A7A", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 14 }}>
                ← All Deliveries
            </Link>

            {/* Title row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
                <div>
                    <h1 style={{ fontFamily: "Georgia, serif", color: "#6B4E4E", fontSize: "1.4rem", margin: "0 0 4px" }}>
                        Delivery #{String(id).slice(-10).toUpperCase()}
                    </h1>
                    <p style={{ margin: 0, fontSize: "0.78rem", color: "#9A7A7A" }}>
                        Created {new Date(delivery.createdAt).toLocaleString("en-NP")}
                        {orderId && (
                            <>
                                {" · "}
                                <Link href={`/admin/orders/${orderId}`} style={{ color: "#6B4E4E", textDecoration: "none" }}>
                                    Order #{String(orderId).slice(-8).toUpperCase()} {Ico.link}
                                </Link>
                            </>
                        )}
                    </p>
                </div>
                <span style={{ padding: "5px 14px", borderRadius: 100, fontSize: "0.78rem", fontWeight: 600, background: cfg.bg, color: cfg.color, display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot }} />
                    {cfg.label}
                </span>
            </div>

            <FeedbackBanner msg={msg} />

            {/* ── Status pipeline ── */}
            <div style={{ background: "white", borderRadius: 14, padding: "20px 24px", border: "1px solid #F3E6E6", marginBottom: 16 }}>
                <h3 style={{ margin: "0 0 16px", fontSize: "0.85rem", fontWeight: 600, color: "#6B4E4E", display: "flex", alignItems: "center", gap: 6 }}>
                    {Ico.truck} Delivery Status
                </h3>
                {!isCancelled && !isFailed ? (
                    <DeliveryPipeline status={delivery.status} />
                ) : (
                    <div style={{ padding: "12px 16px", background: isCancelled ? "#F3F4F6" : "#FEF2F2", borderRadius: 10, borderLeft: `3px solid ${isCancelled ? "#9CA3AF" : "#EF4444"}` }}>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: "0.85rem", color: isCancelled ? "#4B5563" : "#B91C1C" }}>
                            Delivery {isCancelled ? "Cancelled" : "Failed"}
                            {delivery.cancelledBy && ` by ${delivery.cancelledBy}`}
                        </p>
                        {delivery.cancelReason && (
                            <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "#6B7280" }}>{delivery.cancelReason}</p>
                        )}
                    </div>
                )}
                {delivery.deliveredAt && (
                    <p style={{ margin: "12px 0 0", fontSize: "0.78rem", color: "#166534", display: "flex", alignItems: "center", gap: 5 }}>
                        {Ico.check} Delivered on {new Date(delivery.deliveredAt).toLocaleString("en-NP")}
                    </p>
                )}
            </div>

            {/* ── Two-column: recipient + update panel ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

                {/* Recipient details */}
                <div style={{ background: "white", borderRadius: 14, padding: "18px 20px", border: "1px solid #F3E6E6" }}>
                    <h3 style={{ margin: "0 0 14px", fontSize: "0.85rem", fontWeight: 600, color: "#6B4E4E", display: "flex", alignItems: "center", gap: 6 }}>
                        {Ico.user} Recipient
                    </h3>
                    <dl style={{ margin: 0, display: "flex", flexDirection: "column", gap: 8, fontSize: "0.82rem" }}>
                        <div>
                            <dt style={{ fontSize: "0.65rem", color: "#9A7A7A", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 1 }}>Name</dt>
                            <dd style={{ margin: 0, fontWeight: 600, color: "#6B4E4E" }}>{delivery.recipientName}</dd>
                        </div>
                        <div>
                            <dt style={{ fontSize: "0.65rem", color: "#9A7A7A", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 1 }}>Phone</dt>
                            <dd style={{ margin: 0, color: "#7A6060" }}>{delivery.recipientPhone}</dd>
                        </div>
                        <div>
                            <dt style={{ fontSize: "0.65rem", color: "#9A7A7A", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 1, display: "flex", alignItems: "center", gap: 4 }}>
                                {Ico.pin} Address
                            </dt>
                            <dd style={{ margin: 0, color: "#7A6060", lineHeight: 1.5 }}>
                                {delivery.address?.street}<br />
                                {delivery.address?.city}{delivery.address?.state && `, ${delivery.address.state}`}
                                {delivery.address?.zip && ` ${delivery.address.zip}`}<br />
                                {delivery.address?.country}
                            </dd>
                        </div>
                        {delivery.scheduledDate && (
                            <div>
                                <dt style={{ fontSize: "0.65rem", color: "#9A7A7A", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 1 }}>Scheduled</dt>
                                <dd style={{ margin: 0, color: "#7A6060" }}>{new Date(delivery.scheduledDate).toLocaleDateString("en-NP", { weekday: "short", day: "numeric", month: "short" })}</dd>
                            </div>
                        )}
                        {delivery.estimatedDelivery && (
                            <div>
                                <dt style={{ fontSize: "0.65rem", color: "#9A7A7A", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 1, display: "flex", alignItems: "center", gap: 4 }}>
                                    {Ico.clock} Est. Delivery
                                </dt>
                                <dd style={{ margin: 0, color: "#7A6060" }}>{new Date(delivery.estimatedDelivery).toLocaleDateString("en-NP", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</dd>
                            </div>
                        )}
                    </dl>
                </div>

                {/* Update panel — only if not terminal */}
                {canEdit ? (
                    <div style={{ background: "white", borderRadius: 14, padding: "18px 20px", border: "1px solid #F3E6E6" }}>
                        <h3 style={{ margin: "0 0 14px", fontSize: "0.85rem", fontWeight: 600, color: "#6B4E4E" }}>
                            Update Delivery
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <div>
                                <label style={lbl}>Status</label>
                                <select
                                    value={editStatus}
                                    onChange={e => setEditStatus(e.target.value)}
                                    style={{ ...inp, cursor: "pointer", appearance: "auto" }}
                                >
                                    {DELIVERY_STATUSES.map(s => (
                                        <option key={s.value} value={s.value}>{s.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={lbl}>Estimated Delivery Date</label>
                                <input
                                    type="date"
                                    value={editEst}
                                    onChange={e => setEditEst(e.target.value)}
                                    style={inp}
                                    min={new Date().toISOString().split("T")[0]}
                                />
                            </div>
                            <div>
                                <label style={{ ...lbl, display: "flex", alignItems: "center", gap: 4 }}>
                                    {Ico.note} Internal Notes
                                </label>
                                <textarea
                                    value={editNotes}
                                    onChange={e => setEditNotes(e.target.value)}
                                    placeholder="Driver info, handling instructions…"
                                    rows={2}
                                    style={{ ...inp, resize: "vertical" }}
                                />
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                <button
                                    onClick={handleSaveChanges}
                                    disabled={saving}
                                    style={{
                                        flex: 1, padding: "9px", background: saving ? "#C4A090" : "#6B4E4E",
                                        color: "white", border: "none", borderRadius: 8,
                                        cursor: saving ? "not-allowed" : "pointer",
                                        fontSize: "0.82rem", fontFamily: "inherit", fontWeight: 500,
                                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                                    }}
                                >
                                    {saving ? <><Spinner /> Saving…</> : <>{Ico.check} Save Changes</>}
                                </button>
                                <button
                                    onClick={() => setShowCancelModal(true)}
                                    style={{
                                        padding: "9px 14px", background: "white", color: "#EF4444",
                                        border: "1.5px solid #FCA5A5", borderRadius: 8,
                                        cursor: "pointer", fontSize: "0.78rem", fontFamily: "inherit",
                                    }}
                                >
                                    Cancel Delivery
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ background: "white", borderRadius: 14, padding: "18px 20px", border: "1px solid #F3E6E6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <p style={{ color: "#9A7A7A", fontSize: "0.85rem", textAlign: "center", margin: 0 }}>
                            This delivery is <strong>{cfg.label.toLowerCase()}</strong> and cannot be modified.
                        </p>
                    </div>
                )}
            </div>

            {/* ── Tracking updates ── */}
            <div style={{ background: "white", borderRadius: 14, padding: "18px 20px", border: "1px solid #F3E6E6" }}>
                <h3 style={{ margin: "0 0 16px", fontSize: "0.85rem", fontWeight: 600, color: "#6B4E4E" }}>
                    Tracking Updates
                    <span style={{ marginLeft: 8, fontSize: "0.72rem", fontWeight: 400, color: "#9A7A7A" }}>
                        ({delivery.trackingUpdates?.length || 0} total · visible to customer)
                    </span>
                </h3>

                {/* Add new update */}
                {!isCancelled && (
                    <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                        <input
                            type="text"
                            value={trackingMsg}
                            onChange={e => setTrackingMsg(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && !addingTrack && handleAddTracking()}
                            placeholder="e.g. Package picked up from store — press Enter or click Add"
                            style={{ flex: 1, padding: "9px 12px", border: "1.5px solid #E8D4D4", borderRadius: 8, fontSize: "0.82rem", fontFamily: "inherit", outline: "none" }}
                        />
                        <button
                            onClick={handleAddTracking}
                            disabled={addingTrack || !trackingMsg.trim()}
                            style={{
                                padding: "9px 16px", background: "#6B4E4E", color: "white",
                                border: "none", borderRadius: 8, cursor: !trackingMsg.trim() ? "not-allowed" : "pointer",
                                fontSize: "0.82rem", fontFamily: "inherit", whiteSpace: "nowrap",
                                opacity: !trackingMsg.trim() ? 0.5 : 1,
                                display: "flex", alignItems: "center", gap: 5,
                            }}
                        >
                            {addingTrack ? <Spinner /> : Ico.plus} Add
                        </button>
                    </div>
                )}

                {/* Timeline */}
                {!delivery.trackingUpdates?.length ? (
                    <p style={{ color: "#9A7A7A", fontSize: "0.82rem" }}>No tracking updates yet.</p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {[...delivery.trackingUpdates].reverse().map((update: any, idx: number) => {
                            const isLatest = idx === 0;
                            const total = delivery.trackingUpdates.length;
                            return (
                                <div key={idx} style={{ display: "flex", gap: 12, paddingBottom: idx < total - 1 ? 16 : 0 }}>
                                    {/* Dot + line */}
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                                        <div style={{
                                            width: 10, height: 10, borderRadius: "50%", marginTop: 4, flexShrink: 0,
                                            background: isLatest ? "#6B4E4E" : "#E0D4CC",
                                            boxShadow: isLatest ? "0 0 0 3px rgba(107,78,78,0.12)" : "none",
                                        }} />
                                        {idx < total - 1 && (
                                            <div style={{ width: 1, flex: 1, background: "#F0E0D8", marginTop: 3 }} />
                                        )}
                                    </div>
                                    {/* Content */}
                                    <div style={{ paddingBottom: idx < total - 1 ? 4 : 0, flex: 1 }}>
                                        <p style={{ margin: 0, fontSize: "0.85rem", color: isLatest ? "#3D2314" : "#6B4E4E", fontWeight: isLatest ? 500 : 400 }}>
                                            {update.message}
                                        </p>
                                        <p style={{ margin: "3px 0 0", fontSize: "0.7rem", color: "#9A7A7A" }}>
                                            {new Date(update.timestamp).toLocaleString("en-NP")}
                                            {update.updatedBy && (
                                                <span> · by <strong style={{ color: "#7A6060" }}>{update.updatedBy}</strong></span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Cancel modal ── */}
            {showCancelModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
                    <div style={{ background: "white", borderRadius: 16, padding: 28, maxWidth: 420, width: "100%", boxShadow: "0 24px 60px rgba(0,0,0,0.15)" }}>
                        <h3 style={{ margin: "0 0 8px", color: "#6B4E4E", fontFamily: "Georgia, serif", fontSize: "1.1rem" }}>
                            Cancel Delivery?
                        </h3>
                        <p style={{ margin: "0 0 14px", color: "#9A7A7A", fontSize: "0.85rem" }}>
                            This reason will appear in the customer's tracking timeline.
                        </p>
                        <textarea
                            value={cancelReason}
                            onChange={e => setCancelReason(e.target.value)}
                            placeholder="e.g. Driver unavailable in this area"
                            rows={3}
                            autoFocus
                            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #E8D4D4", fontSize: "0.85rem", fontFamily: "inherit", boxSizing: "border-box", outline: "none", resize: "vertical" }}
                        />
                        <div style={{ display: "flex", gap: 10, marginTop: 16, justifyContent: "flex-end" }}>
                            <button
                                onClick={() => { setShowCancelModal(false); setCancelReason(""); }}
                                style={{ padding: "9px 20px", background: "white", border: "1.5px solid #E8D4D4", borderRadius: 100, cursor: "pointer", fontSize: "0.82rem", color: "#6B4E4E", fontFamily: "inherit" }}
                            >
                                Keep Delivery
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={cancelling || !cancelReason.trim()}
                                style={{ padding: "9px 20px", background: "#EF4444", color: "white", border: "none", borderRadius: 100, cursor: !cancelReason.trim() ? "not-allowed" : "pointer", fontSize: "0.82rem", fontFamily: "inherit", opacity: !cancelReason.trim() ? 0.5 : 1 }}
                            >
                                {cancelling ? "Cancelling…" : "Confirm Cancel"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

function Spinner() {
    return (
        <span style={{
            width: 12, height: 12,
            border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "white",
            borderRadius: "50%", animation: "spin 0.6s linear infinite",
            display: "inline-block", flexShrink: 0,
        }} />
    );
}