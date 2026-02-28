// app/user/orders/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getMyOrdersAction } from "@/lib/actions/order-action";

type OrderStatus =
    | "pending" | "confirmed" | "preparing"
    | "out_for_delivery" | "delivered" | "cancelled";

const STATUS_CONFIG: Record<OrderStatus, {
    label: string; color: string; bg: string; dot: string; border: string;
}> = {
    pending: { label: "Pending", color: "#92400E", bg: "#FFFBEB", dot: "#F59E0B", border: "#FDE68A" },
    confirmed: { label: "Confirmed", color: "#1E40AF", bg: "#EFF6FF", dot: "#3B82F6", border: "#BFDBFE" },
    preparing: { label: "Preparing", color: "#5B21B6", bg: "#F5F3FF", dot: "#8B5CF6", border: "#DDD6FE" },
    out_for_delivery: { label: "Out for Delivery", color: "#065F46", bg: "#F0FDF4", dot: "#10B981", border: "#A7F3D0" },
    delivered: { label: "Delivered", color: "#166534", bg: "#DCFCE7", dot: "#22C55E", border: "#86EFAC" },
    cancelled: { label: "Cancelled", color: "#991B1B", bg: "#FFF1F2", dot: "#EF4444", border: "#FECDD3" },
};

const STATUS_STEP_ICONS: Record<OrderStatus, React.ReactNode> = {
    pending: (
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    ),
    confirmed: (
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    ),
    preparing: (
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L4.2 15.3m15.6 0 1.149 2.513a.75.75 0 0 1-.67 1.084H3.721a.75.75 0 0 1-.67-1.084L4.2 15.3" />
        </svg>
    ),
    out_for_delivery: (
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
    ),
    delivered: (
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
    ),
    cancelled: (
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
    ),
};

function StatusBadge({ status }: { status: OrderStatus }) {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
    return (
        <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.68rem] font-semibold border"
            style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}
        >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
            {cfg.label}
        </span>
    );
}

function OrderCard({ order }: { order: any }) {
    const cfg = STATUS_CONFIG[order.status as OrderStatus] ?? STATUS_CONFIG.pending;
    const itemNames = order.items?.slice(0, 2).map((i: any) => i.name).join(", ") ?? "";
    const extra = order.items?.length > 2 ? ` +${order.items.length - 2} more` : "";

    return (
        <Link href={`/user/orders/${order._id}`} className="no-underline group block">
            <div
                className="bg-white rounded-2xl border overflow-hidden transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-0.5"
                style={{ borderColor: "#F3E6E6" }}
            >
                {/* Coloured top strip */}
                <div className="h-1 w-full" style={{ background: cfg.dot }} />

                <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                        {/* Left side */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className="font-mono text-[0.68rem] text-[#B0A0A0] bg-[#F9F5F5] px-2 py-0.5 rounded-md">
                                    #{order._id.slice(-8).toUpperCase()}
                                </span>
                                <StatusBadge status={order.status} />
                                {order.cancelledBy && (
                                    <span className="text-[0.65rem] text-[#9A7A7A] bg-[#F5F5F5] px-2 py-0.5 rounded-md">
                                        by {order.cancelledBy}
                                    </span>
                                )}
                            </div>

                            {/* Item names */}
                            <p className="text-sm text-[#6B4E4E] font-medium mb-1 truncate">
                                {itemNames}
                                {extra && <span className="text-[#9A7A7A]">{extra}</span>}
                            </p>

                            {/* Cancel reason */}
                            {order.cancelReason && (
                                <p className="text-xs text-red-500 mb-1 truncate">
                                    Reason: {order.cancelReason}
                                </p>
                            )}

                            {/* Meta row */}
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-[0.68rem] text-[#9A7A7A] flex items-center gap-1">
                                    <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                    </svg>
                                    {new Date(order.createdAt).toLocaleDateString("en-NP", { day: "numeric", month: "short", year: "numeric" })}
                                </span>
                                <span className="text-[0.68rem] text-[#9A7A7A] flex items-center gap-1">
                                    <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
                                    </svg>
                                    {order.items?.length} item{order.items?.length !== 1 ? "s" : ""}
                                </span>
                                <span className="text-[0.68rem] text-[#9A7A7A] capitalize flex items-center gap-1">
                                    <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                                    </svg>
                                    {order.paymentMethod?.replace(/_/g, " ")}
                                </span>
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <div className="text-right">
                                <p className="text-lg font-bold text-[#6B4E4E]">
                                    Rs.&nbsp;{order.totalAmount?.toLocaleString()}
                                </p>
                                <p className="text-[0.68rem] text-[#9A7A7A] capitalize">
                                    {order.paymentStatus}
                                </p>
                            </div>
                            <div className="flex items-center gap-1 text-[0.68rem] text-[#9A7A7A] group-hover:text-[#6B4E4E] transition-colors">
                                View details
                                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

const FILTER_OPTIONS: { value: string; label: string }[] = [
    { value: "all", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "preparing", label: "Preparing" },
    { value: "out_for_delivery", label: "Out for Delivery" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
];

export default function UserOrdersPage() {
    const [allOrders, setAllOrders] = useState<any[]>([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        (async () => {
            setLoading(true);
            const res = await getMyOrdersAction(1, 100); // fetch enough to filter client-side
            if (res.success) {
                setAllOrders(res.data || []);
                setPagination(res.pagination || { page: 1, totalPages: 1, total: 0 });
            }
            setLoading(false);
        })();
    }, []);

    const filtered = filter === "all" ? allOrders : allOrders.filter(o => o.status === filter);
    const PAGE_SIZE = 8;
    const totalFilteredPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginatedOrders = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleFilterChange = (val: string) => {
        setFilter(val);
        setPage(1);
    };

    // Count per status for badges
    const countByStatus: Record<string, number> = {};
    allOrders.forEach(o => {
        countByStatus[o.status] = (countByStatus[o.status] || 0) + 1;
    });

    return (
        <div className="min-h-screen bg-[#FBF6F4]">
            <div className="max-w-3xl mx-auto px-4 py-8">

                {/* ── Header ── */}
                <div className="mb-7">
                    <Link
                        href="/user/dashboard"
                        className="inline-flex items-center gap-1.5 text-xs text-[#9A7A7A] hover:text-[#6B4E4E] transition-colors no-underline mb-4"
                    >
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                        Back to Dashboard
                    </Link>

                    <div className="flex items-end justify-between">
                        <div>
                            <h1 className="font-serif text-[#6B4E4E] text-3xl leading-tight">My Orders</h1>
                            {!loading && (
                                <p className="text-[#9A7A7A] text-sm mt-1">
                                    {allOrders.length} order{allOrders.length !== 1 ? "s" : ""} total
                                </p>
                            )}
                        </div>
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#6B4E4E] text-white text-xs font-semibold hover:bg-[#5A3A3A] transition-colors no-underline"
                        >
                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                            </svg>
                            Shop More
                        </Link>
                    </div>
                </div>

                {/* ── Filter tabs ── */}
                {!loading && allOrders.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap mb-6">
                        {FILTER_OPTIONS.map(({ value, label }) => {
                            const isActive = filter === value;
                            const count = value === "all" ? allOrders.length : (countByStatus[value] || 0);
                            if (value !== "all" && count === 0) return null;
                            return (
                                <button
                                    key={value}
                                    onClick={() => handleFilterChange(value)}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${isActive
                                            ? "bg-[#6B4E4E] text-white"
                                            : "bg-white border border-[#E8D4D4] text-[#9A7A7A] hover:bg-[#F3E6E6] hover:text-[#6B4E4E]"
                                        }`}
                                >
                                    {label}
                                    <span className={`text-[0.6rem] px-1.5 py-0.5 rounded-full font-bold ${isActive ? "bg-white/20 text-white" : "bg-[#F3E6E6] text-[#9A7A7A]"
                                        }`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* ── Content ── */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4 text-[#9A7A7A]">
                        <div className="w-10 h-10 rounded-full bg-[#F3E6E6] flex items-center justify-center animate-pulse">
                            <svg width="20" height="20" fill="none" stroke="#C4A0A0" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                            </svg>
                        </div>
                        <p className="text-sm">Loading your orders…</p>
                    </div>
                ) : allOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-[#F3E6E6] p-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-[#F3E6E6] flex items-center justify-center mx-auto mb-4">
                            <svg width="28" height="28" fill="none" stroke="#C4A0A0" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                            </svg>
                        </div>
                        <h2 className="font-serif text-[#6B4E4E] text-xl mb-2">No orders yet</h2>
                        <p className="text-[#9A7A7A] text-sm mb-6">
                            You haven't placed any orders. Browse our collection to get started.
                        </p>
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#6B4E4E] text-white text-sm font-semibold hover:bg-[#5A3A3A] transition-colors no-underline"
                        >
                            Browse Shop
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </Link>
                    </div>
                ) : paginatedOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-[#F3E6E6] p-12 text-center text-[#9A7A7A] text-sm">
                        No orders with this status.
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {paginatedOrders.map((order: any) => (
                            <OrderCard key={order._id} order={order} />
                        ))}
                    </div>
                )}

                {/* ── Pagination ── */}
                {totalFilteredPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <button
                            onClick={() => setPage(p => p - 1)}
                            disabled={page === 1}
                            className="px-5 py-2 rounded-full border border-[#E8D4D4] bg-white text-[#6B4E4E] text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F3E6E6] transition-colors"
                        >
                            ← Previous
                        </button>
                        <span className="text-sm text-[#9A7A7A]">
                            Page {page} of {totalFilteredPages}
                        </span>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={page === totalFilteredPages}
                            className="px-5 py-2 rounded-full border border-[#E8D4D4] bg-white text-[#6B4E4E] text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F3E6E6] transition-colors"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}