// app/admin/users/_components/UserTable.tsx
"use client";

import Link from "next/link";
import { handleDeleteUser } from "@/lib/actions/admin/user-action";
import { toast } from "react-toastify";

type User = {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    role: string;
};

export default function UserTable({ users }: { users: User[] }) {
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        const res = await handleDeleteUser(id);
        if (res.success) {
            toast.success("User deleted successfully");
            // Simple refresh (you can later use router.refresh() or mutate)
            window.location.reload();
        } else {
            toast.error(res.message || "Failed to delete user");
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-rose-100">
            <table className="w-full text-left">
                <thead className="bg-[#F3E6E6]">
                    <tr>
                        <th className="px-8 py-5 text-sm font-medium text-[#6B4E4E]">Name</th>
                        <th className="px-8 py-5 text-sm font-medium text-[#6B4E4E]">Username</th>
                        <th className="px-8 py-5 text-sm font-medium text-[#6B4E4E]">Email</th>
                        <th className="px-8 py-5 text-sm font-medium text-[#6B4E4E]">Role</th>
                        <th className="px-8 py-5 text-sm font-medium text-[#6B4E4E]">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-8 py-12 text-center text-gray-500 text-lg">
                                No users found
                            </td>
                        </tr>
                    ) : (
                        users.map((user) => (
                            <tr key={user._id} className="border-t hover:bg-[#F9F5F5] transition">
                                <td className="px-8 py-6 text-[#6B4E4E]">
                                    {user.firstName} {user.lastName}
                                </td>
                                <td className="px-8 py-6 text-[#6B4E4E]">{user.username}</td>
                                <td className="px-8 py-6 text-[#6B4E4E]">{user.email}</td>
                                <td className="px-8 py-6">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === "admin"
                                            ? "bg-[#E8B4B8] text-white"
                                            : "bg-gray-200 text-gray-700"
                                            }`}
                                    >
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-8 py-6 flex gap-5">
                                    <Link
                                        href={`/admin/users/${user._id}`}
                                        className="text-[#6B4E4E] hover:text-[#E8B4B8] font-medium"
                                    >
                                        View
                                    </Link>
                                    <Link
                                        href={`/admin/users/${user._id}/edit`}
                                        className="text-[#6B4E4E] hover:text-[#E8B4B8] font-medium"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(user._id)}
                                        className="text-rose-500 hover:text-rose-700 font-medium"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}