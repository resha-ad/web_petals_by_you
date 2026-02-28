"use client";

import Link from "next/link";
import { handleDeleteUser } from "@/lib/actions/admin/user-action";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type User = {
    _id: string;
    firstName?: string;
    lastName?: string;
    username: string;
    email: string;
    phone?: string | null;
    role: string;
    imageUrl?: string | null;
    createdAt?: string;
};

type UserTableProps = {
    users: User[];
    pagination?: {
        page: number;
        limit?: number;
        size?: number;
        total: number;
        totalPages: number;
    };
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export default function UserTable({ users, pagination }: UserTableProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;
    const [confirmId, setConfirmId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async (id: string) => {
        setDeleting(true);
        const res = await handleDeleteUser(id);
        if (res.success) {
            toast.success("User deleted");
            router.refresh();
        } else {
            toast.error(res.message || "Failed to delete user");
        }
        setDeleting(false);
        setConfirmId(null);
    };

    const changePage = (p: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", p.toString());
        router.push(`/admin/users?${params.toString()}`);
    };

    if (users.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-[#F3E6E6] p-16 text-center text-[#9A7A7A] text-sm">
                No users found.
            </div>
        );
    }

    return (
        <div>
            {/* Table */}
            <div className="bg-white rounded-2xl border border-[#F3E6E6] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-[#FBF6F4] border-b-2 border-[#F3E6E6]">
                                {["User", "Username", "Email", "Phone", "Role", "Joined", "Actions"].map((h) => (
                                    <th
                                        key={h}
                                        className="px-4 py-3 text-left text-[0.68rem] font-bold text-[#9A7A7A] uppercase tracking-wider whitespace-nowrap"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, idx) => (
                                <tr
                                    key={user._id}
                                    className={`hover:bg-[#FBF6F4] transition-colors ${idx < users.length - 1 ? "border-b border-[#F9F0EE]" : ""
                                        }`}
                                >
                                    {/* User avatar + name */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-[#F3E6E6] overflow-hidden flex-shrink-0 flex items-center justify-center border border-[#EDD8D8]">
                                                {user.imageUrl ? (
                                                    <img
                                                        src={`${API_BASE}${user.imageUrl}`}
                                                        alt={user.username}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <svg width="16" height="16" fill="none" stroke="#C4A0A0" strokeWidth="1.5" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span className="font-medium text-[#6B4E4E] text-sm">
                                                {[user.firstName, user.lastName].filter(Boolean).join(" ") || "—"}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Username */}
                                    <td className="px-4 py-3 text-[#7A6060] text-sm">@{user.username}</td>

                                    {/* Email */}
                                    <td className="px-4 py-3 text-[#7A6060] text-sm">{user.email}</td>

                                    {/* Phone */}
                                    <td className="px-4 py-3 text-[#7A6060] text-sm">
                                        {user.phone || <span className="text-[#C0B0B0]">—</span>}
                                    </td>

                                    {/* Role badge */}
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.68rem] font-semibold ${user.role === "admin"
                                                    ? "bg-[#F3E6E6] text-[#6B4E4E]"
                                                    : "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            <span
                                                className={`w-1.5 h-1.5 rounded-full ${user.role === "admin" ? "bg-[#6B4E4E]" : "bg-gray-400"
                                                    }`}
                                            />
                                            {user.role}
                                        </span>
                                    </td>

                                    {/* Joined */}
                                    <td className="px-4 py-3 text-[#9A7A7A] text-xs whitespace-nowrap">
                                        {user.createdAt
                                            ? new Date(user.createdAt).toLocaleDateString("en-NP", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })
                                            : "—"}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/admin/users/${user._id}`}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E8D4D4] text-[#6B4E4E] text-xs hover:bg-[#F3E6E6] transition-colors no-underline"
                                            >
                                                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                </svg>
                                                View
                                            </Link>
                                            <Link
                                                href={`/admin/users/${user._id}/edit`}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E8D4D4] text-[#6B4E4E] text-xs hover:bg-[#F3E6E6] transition-colors no-underline"
                                            >
                                                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                </svg>
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => setConfirmId(user._id)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-200 text-red-500 text-xs hover:bg-red-50 transition-colors cursor-pointer bg-white"
                                            >
                                                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                    <button
                        onClick={() => changePage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-5 py-2 rounded-full border border-[#E8D4D4] bg-white text-[#6B4E4E] text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F3E6E6] transition-colors"
                    >
                        ← Previous
                    </button>
                    <span className="text-sm text-[#9A7A7A]">
                        Page {currentPage} of {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => changePage(currentPage + 1)}
                        disabled={currentPage === pagination.totalPages}
                        className="px-5 py-2 rounded-full border border-[#E8D4D4] bg-white text-[#6B4E4E] text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F3E6E6] transition-colors"
                    >
                        Next →
                    </button>
                </div>
            )}

            {/* Delete confirm modal */}
            {confirmId && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-7 max-w-sm w-full shadow-2xl">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                                <svg width="18" height="18" fill="none" stroke="#EF4444" strokeWidth="1.8" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-serif text-[#6B4E4E] text-lg leading-tight">Delete User?</h3>
                                <p className="text-[#9A7A7A] text-xs mt-0.5">This action cannot be undone.</p>
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end mt-5">
                            <button
                                onClick={() => setConfirmId(null)}
                                className="px-5 py-2 rounded-full border border-[#E8D4D4] text-[#6B4E4E] text-sm bg-white hover:bg-[#F3E6E6] transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(confirmId)}
                                disabled={deleting}
                                className="px-5 py-2 rounded-full bg-red-500 text-white text-sm disabled:opacity-60 hover:bg-red-600 transition-colors cursor-pointer"
                            >
                                {deleting ? "Deleting…" : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}