"use client";

// app/admin/notifications/page.tsx
// Admin UI for managing notifications: create, edit, delete
// Target options: "all" (everyone) or "user" (regular users only).
// Admins manage notifications but do not receive them as a target group.

import { useState, useEffect, useTransition } from "react";
import { toast } from "react-toastify";
import {
    getAllNotificationsAdminAction,
    createNotificationAction,
    updateNotificationAction,
    deleteNotificationAction,
} from "@/lib/actions/notification-action";

type Notification = {
    _id: string;
    title: string;
    message: string;
    type: "info" | "warning" | "success" | "promo";
    targetRole: "all" | "user";
    isActive: boolean;
    createdAt: string;
    createdBy?: { username: string; email: string };
};

type FormState = {
    title: string;
    message: string;
    type: "info" | "warning" | "success" | "promo";
    targetRole: "all" | "user";
};

const TYPES = ["info", "warning", "success", "promo"] as const;
// "admin" removed — admins create notifications, they don't receive them
const ROLES = ["all", "user"] as const;

const typeConfig = {
    info: { label: "Info", color: "bg-blue-100   text-blue-700   border-blue-200" },
    warning: { label: "Warning", color: "bg-amber-100  text-amber-700  border-amber-200" },
    success: { label: "Success", color: "bg-green-100  text-green-700  border-green-200" },
    promo: { label: "Promo", color: "bg-rose-100   text-rose-700   border-rose-200" },
};

const roleConfig = {
    all: { label: "All users" },
    user: { label: "Regular users" },
};

const emptyForm: FormState = { title: "", message: "", type: "info", targetRole: "all" };

export default function AdminNotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Notification | null>(null);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [pending, startTransition] = useTransition();

    const fetchAll = async () => {
        setLoading(true);
        const res = await getAllNotificationsAdminAction();
        if (res.notifications) setNotifications(res.notifications);
        setLoading(false);
    };

    useEffect(() => { fetchAll(); }, []);

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setShowForm(true);
    };

    const openEdit = (n: Notification) => {
        setEditing(n);
        setForm({ title: n.title, message: n.message, type: n.type, targetRole: n.targetRole });
        setShowForm(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim() || !form.message.trim()) {
            toast.error("Title and message are required");
            return;
        }
        startTransition(async () => {
            const res = editing
                ? await updateNotificationAction(editing._id, form)
                : await createNotificationAction(form);
            if (res.success) {
                toast.success(editing ? "Notification updated" : "Notification created");
                setShowForm(false);
                fetchAll();
            } else {
                toast.error(res.message || "Failed");
            }
        });
    };

    const handleDelete = (id: string) => {
        if (!confirm("Delete this notification?")) return;
        startTransition(async () => {
            const res = await deleteNotificationAction(id);
            if (res.success) {
                toast.success("Deleted");
                setNotifications((prev) => prev.filter((n) => n._id !== id));
            } else {
                toast.error(res.message || "Failed to delete");
            }
        });
    };

    const handleToggleActive = (n: Notification) => {
        startTransition(async () => {
            const res = await updateNotificationAction(n._id, { isActive: !n.isActive });
            if (res.success) fetchAll();
        });
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-serif text-[#6B4E4E]">Notifications</h1>
                    <p className="text-sm text-[#9A7A7A] mt-0.5">Send and manage user notifications</p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6B4E4E] text-white text-sm hover:bg-[#5A3A3A] transition-colors"
                >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    New Notification
                </button>
            </div>

            {/* Form modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6">
                        <h2 className="text-lg font-serif text-[#6B4E4E] mb-4">
                            {editing ? "Edit Notification" : "Create Notification"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-[#9A7A7A] uppercase tracking-wider mb-1.5">Title *</label>
                                <input
                                    value={form.title}
                                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                                    placeholder="Notification title"
                                    className="w-full px-3 py-2 rounded-lg border border-[#E8D4D4] text-[#6B4E4E] text-sm outline-none focus:border-[#C4A0A0]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#9A7A7A] uppercase tracking-wider mb-1.5">Message *</label>
                                <textarea
                                    value={form.message}
                                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                                    placeholder="Notification message"
                                    rows={3}
                                    className="w-full px-3 py-2 rounded-lg border border-[#E8D4D4] text-[#6B4E4E] text-sm outline-none focus:border-[#C4A0A0] resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-[#9A7A7A] uppercase tracking-wider mb-1.5">Type</label>
                                    <select
                                        value={form.type}
                                        onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as FormState["type"] }))}
                                        className="w-full px-3 py-2 rounded-lg border border-[#E8D4D4] text-[#6B4E4E] text-sm outline-none focus:border-[#C4A0A0]"
                                    >
                                        {TYPES.map((t) => <option key={t} value={t}>{typeConfig[t].label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#9A7A7A] uppercase tracking-wider mb-1.5">Target</label>
                                    <select
                                        value={form.targetRole}
                                        onChange={(e) => setForm((f) => ({ ...f, targetRole: e.target.value as FormState["targetRole"] }))}
                                        className="w-full px-3 py-2 rounded-lg border border-[#E8D4D4] text-[#6B4E4E] text-sm outline-none focus:border-[#C4A0A0]"
                                    >
                                        {ROLES.map((r) => <option key={r} value={r}>{roleConfig[r].label}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 py-2.5 rounded-full border border-[#E8D4D4] text-[#9A7A7A] text-sm hover:bg-rose-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={pending}
                                    className="flex-1 py-2.5 rounded-full bg-[#6B4E4E] text-white text-sm hover:bg-[#5A3A3A] disabled:opacity-60 transition-colors"
                                >
                                    {pending ? "Saving…" : editing ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Notifications list */}
            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((k) => (
                        <div key={k} className="h-20 bg-rose-50 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : notifications.length === 0 ? (
                <div className="text-center py-16 text-[#9A7A7A]">
                    <div className="text-4xl mb-3">🔔</div>
                    <p className="text-sm">No notifications created yet.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((n) => (
                        <div
                            key={n._id}
                            className={`flex items-start gap-4 p-4 rounded-xl border bg-white transition-opacity ${!n.isActive ? "opacity-50" : ""}`}
                            style={{ borderColor: "#F3E6E6" }}
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${typeConfig[n.type].color}`}>
                                        {typeConfig[n.type].label}
                                    </span>
                                    <span className="text-[10px] text-[#B09090] bg-rose-50 px-2 py-0.5 rounded-full">
                                        → {roleConfig[n.targetRole]?.label ?? n.targetRole}
                                    </span>
                                    {!n.isActive && (
                                        <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Inactive</span>
                                    )}
                                </div>
                                <p className="text-sm font-semibold text-[#6B4E4E]">{n.title}</p>
                                <p className="text-xs text-[#9A7A7A] mt-0.5 line-clamp-2">{n.message}</p>
                                <p className="text-[10px] text-[#C4B0B0] mt-1">
                                    {new Date(n.createdAt).toLocaleDateString()}
                                    {n.createdBy && ` · by ${n.createdBy.username}`}
                                </p>
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                {/* Toggle active */}
                                <button
                                    onClick={() => handleToggleActive(n)}
                                    title={n.isActive ? "Deactivate" : "Activate"}
                                    className={`p-1.5 rounded-lg transition-colors ${n.isActive ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-50"}`}
                                >
                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 12.728M5.636 5.636A9 9 0 1 1 18.364 18.364" />
                                    </svg>
                                </button>
                                {/* Edit */}
                                <button
                                    onClick={() => openEdit(n)}
                                    className="p-1.5 rounded-lg text-[#9A7A7A] hover:text-[#6B4E4E] hover:bg-rose-50 transition-colors"
                                >
                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                                    </svg>
                                </button>
                                {/* Delete */}
                                <button
                                    onClick={() => handleDelete(n._id)}
                                    className="p-1.5 rounded-lg text-[#9A7A7A] hover:text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}