"use client";
import Link from "next/link";
import { handleDeleteUser } from "@/lib/actions/admin/user-action";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";

type User = {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    role: string;
};

type UserTableProps = {
    users: User[];
    pagination?: {
        page: number;
        size: number;
        totalItems: number;
        totalPages: number;
    };
};

export default function UserTable({ users, pagination }: UserTableProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentPage = Number(searchParams.get("page")) || 1;
    const currentSize = Number(searchParams.get("size")) || 10;
    const currentSearch = searchParams.get("search") || "";

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
        const res = await handleDeleteUser(id);
        if (res.success) {
            toast.success("User deleted successfully");
            router.refresh(); // re-fetch current page
        } else {
            toast.error(res.message || "Failed to delete user");
        }
    };

    const changePage = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`/admin/users?${params.toString()}`);
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left bg-white rounded-2xl shadow-xl border border-rose-100">
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
                                <td className="px-8 py-6 flex gap-6">
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

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-6">
                    <button
                        onClick={() => changePage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-6 py-3 rounded-full bg-[#E8B4B8]/20 text-[#6B4E4E] disabled:opacity-40 hover:bg-[#E8B4B8]/30 transition disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>

                    <span className="text-base font-medium text-[#6B4E4E]">
                        Page {currentPage} of {pagination.totalPages}
                    </span>

                    <button
                        onClick={() => changePage(currentPage + 1)}
                        disabled={currentPage === pagination.totalPages}
                        className="px-6 py-3 rounded-full bg-[#E8B4B8]/20 text-[#6B4E4E] disabled:opacity-40 hover:bg-[#E8B4B8]/30 transition disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}