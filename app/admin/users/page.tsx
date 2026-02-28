import Link from "next/link";
import UserTable from "./_components/UserTable";
import { handleGetAllUsers } from "@/lib/actions/admin/user-action";

export default async function UsersPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; size?: string; search?: string }>;
}) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const size = Number(params.size) || 15;
    const search = params.search || undefined;

    const result = await handleGetAllUsers(page, size, search);

    if (!result.success) {
        return (
            <div className="text-red-500 text-center py-10 text-sm">
                Error loading users. Please try again.
            </div>
        );
    }

    const users = result.data || [];
    const pagination = result.pagination;

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="font-serif text-[#6B4E4E] text-2xl mb-0.5">Users</h1>
                    <p className="text-[#9A7A7A] text-xs">
                        {pagination?.total ?? users.length} user
                        {(pagination?.total ?? users.length) !== 1 ? "s" : ""} total
                    </p>
                </div>
                <Link
                    href="/admin/users/create"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6B4E4E] text-white text-sm font-semibold hover:bg-[#5A3A3A] transition-colors shadow-sm no-underline"
                >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add User
                </Link>
            </div>

            <UserTable users={users} pagination={pagination} />
        </div>
    );
}