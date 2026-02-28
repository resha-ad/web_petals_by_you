import Link from "next/link";
import CreateUserForm from "@/app/admin/users/_components/CreateUserForm";

export default function CreateUserPage() {
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
                <span className="text-[#6B4E4E]">Create New</span>
            </div>

            <h1 className="font-serif text-[#6B4E4E] text-2xl mb-6">Create New User</h1>

            <div className="bg-white rounded-2xl border border-[#F3E6E6] p-6 shadow-sm">
                <CreateUserForm />
            </div>
        </div>
    );
}