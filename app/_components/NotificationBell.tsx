"use client";

// app/_components/NotificationBell.tsx
// Notification bell with dropdown — for authenticated users

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/app/_contexts/AuthContext";
import {
    getMyNotificationsAction,
    markNotificationReadAction,
    markAllNotificationsReadAction,
    clearNotificationAction,
    clearAllNotificationsAction,
} from "@/lib/actions/notification-action";

type Notification = {
    _id: string;
    title: string;
    message: string;
    type: "info" | "warning" | "success" | "promo";
    isRead: boolean;
    createdAt: string;
};

const typeColors: Record<string, { bg: string; dot: string; icon: string }> = {
    info: { bg: "bg-blue-50   border-blue-100", dot: "bg-blue-400", icon: "ℹ️" },
    warning: { bg: "bg-amber-50  border-amber-100", dot: "bg-amber-400", icon: "⚠️" },
    success: { bg: "bg-green-50  border-green-100", dot: "bg-green-400", icon: "✅" },
    promo: { bg: "bg-rose-50   border-rose-100", dot: "bg-rose-400", icon: "🎁" },
};

function timeAgo(dateStr: string): string {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationBell() {
    const { isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const fetchNotifications = async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        try {
            const res = await getMyNotificationsAction();
            if (res.success && res.data) setNotifications(res.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchNotifications();
            // Poll every 60 seconds for new notifications
            const interval = setInterval(fetchNotifications, 60000);
            return () => clearInterval(interval);
        } else {
            setNotifications([]);
        }
    }, [isAuthenticated]);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleMarkRead = async (id: string) => {
        await markNotificationReadAction(id);
        setNotifications((prev) =>
            prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
    };

    const handleMarkAllRead = async () => {
        await markAllNotificationsReadAction();
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    };

    const handleClear = async (id: string) => {
        await clearNotificationAction(id);
        setNotifications((prev) => prev.filter((n) => n._id !== id));
    };

    const handleClearAll = async () => {
        await clearAllNotificationsAction();
        setNotifications([]);
    };

    if (!isAuthenticated) return null;

    return (
        <div ref={dropdownRef} className="relative">
            {/* Bell button */}
            <button
                onClick={() => {
                    setOpen((v) => !v);
                    if (!open) fetchNotifications();
                }}
                aria-label="Notifications"
                className={`relative flex p-2.5 rounded-full transition-all duration-200 ${open ? "text-[#6B4E4E] bg-rose-50" : "text-[#9A7A7A] hover:text-[#6B4E4E] hover:bg-rose-50"
                    }`}
            >
                {/* Bell SVG */}
                <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
                {/* Badge */}
                {unreadCount > 0 && (
                    <span
                        key={unreadCount}
                        className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-0.5 rounded-full bg-[#E8B4B8] text-white text-[9px] font-bold flex items-center justify-center"
                        style={{ animation: "badgePop 0.25s cubic-bezier(0.34,1.56,0.64,1) both" }}
                    >
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    className="absolute right-0 top-12 w-80 rounded-2xl bg-white border border-rose-100 shadow-xl shadow-rose-100/40 z-50 overflow-hidden"
                    style={{ animation: "dropIn 0.2s cubic-bezier(0.22,1,0.36,1) both" }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-rose-50">
                        <div>
                            <p className="text-sm font-semibold text-[#6B4E4E]">Notifications</p>
                            {unreadCount > 0 && (
                                <p className="text-[10px] text-[#C08080]">{unreadCount} unread</p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="text-[10px] text-[#C08080] hover:text-[#6B4E4E] transition-colors"
                                >
                                    Mark all read
                                </button>
                            )}
                            {notifications.length > 0 && (
                                <button
                                    onClick={handleClearAll}
                                    className="text-[10px] text-[#B0A0A0] hover:text-red-400 transition-colors"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>
                    </div>

                    {/* List */}
                    <div className="max-h-80 overflow-y-auto divide-y divide-rose-50">
                        {loading ? (
                            <div className="py-8 text-center">
                                <div className="w-6 h-6 border-2 border-rose-100 border-t-[#6B4E4E] rounded-full animate-spin mx-auto" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="py-10 text-center">
                                <div className="text-3xl mb-2">🌸</div>
                                <p className="text-xs text-[#B09090]">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((n) => {
                                const style = typeColors[n.type] ?? typeColors.info;
                                return (
                                    <div
                                        key={n._id}
                                        className={`flex gap-3 px-4 py-3 hover:bg-rose-50/40 transition-colors cursor-default ${!n.isRead ? "bg-rose-50/30" : ""
                                            }`}
                                        onClick={() => !n.isRead && handleMarkRead(n._id)}
                                    >
                                        {/* Unread dot */}
                                        <div className="flex-shrink-0 mt-1.5">
                                            <div
                                                className={`w-2 h-2 rounded-full ${n.isRead ? "bg-transparent" : style.dot
                                                    }`}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs font-semibold text-[#6B4E4E] ${!n.isRead ? "" : "opacity-70"}`}>
                                                {n.title}
                                            </p>
                                            <p className="text-[11px] text-[#9A7A7A] mt-0.5 leading-relaxed">
                                                {n.message}
                                            </p>
                                            <p className="text-[10px] text-[#C4B0B0] mt-1">{timeAgo(n.createdAt)}</p>
                                        </div>
                                        {/* Clear button */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleClear(n._id); }}
                                            className="flex-shrink-0 w-5 h-5 rounded-full hover:bg-rose-100 flex items-center justify-center text-[#C4B0B0] hover:text-red-400 transition-colors mt-0.5"
                                            aria-label="Clear"
                                        >
                                            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes dropIn {
                    from { opacity: 0; transform: translateY(-8px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes badgePop {
                    0%   { transform: scale(0.5); opacity: 0; }
                    60%  { transform: scale(1.25); }
                    100% { transform: scale(1);   opacity: 1; }
                }
            `}</style>
        </div>
    );
}