// app/admin/users/page.tsx
import Link from "next/link";
import UserTable from "./_components/UserTable";
import { handleGetAllUsers } from "@/lib/actions/admin/user-action";

export default async function UsersPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; size?: string; search?: string }>;
}) {
    const params = await searchParams;

    // Parse query params with defaults
    const page = Number(params.page) || 1;
    const size = Number(params.size) || 10;
    const search = params.search || undefined;

    // Fetch with current page/size/search
    const result = await handleGetAllUsers(page, size, search);

    if (!result.success) {
        return (
            <div className="text-rose-500 text-center py-10 text-xl">
                Error loading users. Please try again.
            </div>
        );
    }

    const users = result.data || [];
    const pagination = result.pagination;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-serif text-[#6B4E4E]">Users Management</h1>
                <Link
                    href="/admin/users/create"
                    className="px-8 py-4 rounded-full bg-[#E8B4B8] text-white font-medium hover:bg-[#D9A3A7] transition shadow-md"
                >
                    + Create New User
                </Link>
            </div>

            {/* Pass pagination to UserTable so it can show controls */}
            <UserTable users={users} pagination={pagination} />
        </div>
    );
}