import { handleGetUserById } from "@/lib/actions/admin/user-action";
import Link from "next/link";
import { notFound } from "next/navigation";
import EditUserForm from "../../_components/EditUserForm";

export default async function EditUserPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const result = await handleGetUserById(id);

    if (!result.success || !result.data) notFound();

    const user = result.data;

    return (
        <div className="max-w-2xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-[#9A7A7A] mb-4">
                <Link href="/admin/users" className="hover:text-[#6B4E4E] transition-colors no-underline text-[#9A7A7A]">
                    Users
                </Link>
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
                <Link href={`/admin/users/${id}`} className="hover:text-[#6B4E4E] transition-colors no-underline text-[#9A7A7A]">
                    {user.username}
                </Link>
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
                <span className="text-[#6B4E4E]">Edit</span>
            </div>

            <h1 className="font-serif text-[#6B4E4E] text-2xl mb-6">Edit User</h1>

            <div className="bg-white rounded-2xl border border-[#F3E6E6] p-6 shadow-sm">
                <EditUserForm user={user} />
            </div>
        </div>
    );
}