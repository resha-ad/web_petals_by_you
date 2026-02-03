import Link from "next/link";
import UserTable from "./_components/UserTable"; //new client component
import { handleGetAllUsers } from "@/lib/actions/admin/user-action";

export default async function UsersPage() {
    const result = await handleGetAllUsers();

    if (!result.success) {
        return (
            <div className="text-red-500 text-center py-10 text-xl">
                Error loading users. Please try again.
            </div>
        );
    }

    const users = result.data || [];

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-serif text-[#6B4E4E]">Users Management</h1>
                <Link
                    href="/admin/users/create"
                    className="px-8 py-4 rounded-full bg-[#E8B4B8] text-white-grey font-medium hover:bg-[#D9A3A7] transition shadow-md"
                >
                    + Create New User
                </Link>
            </div>

            <UserTable users={users} /> {/* Pass data to Client Component */}
        </div>
    );
}