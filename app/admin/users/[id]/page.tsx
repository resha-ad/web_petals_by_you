import { handleGetUserById } from "@/lib/actions/admin/user-action";
import Link from "next/link";
import { notFound } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

function Field({ label, value }: { label: string; value?: string | null }) {
    return (
        <div>
            <p className="text-[0.68rem] font-bold text-[#9A7A7A] uppercase tracking-wider mb-1">
                {label}
            </p>
            <p className="text-sm text-[#6B4E4E] font-medium">{value || "—"}</p>
        </div>
    );
}

export default async function UserDetailPage({
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
                <span className="text-[#6B4E4E]">{user.username}</span>
            </div>

            <div className="bg-white rounded-2xl border border-[#F3E6E6] overflow-hidden shadow-sm">
                {/* Header band */}
                <div className="bg-gradient-to-r from-[#6B4E4E] to-[#3D2314] px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full border-2 border-white/30 overflow-hidden flex-shrink-0 bg-[#5A3A3A] flex items-center justify-center">
                            {user.imageUrl ? (
                                <img
                                    src={`${API_BASE}${user.imageUrl}`}
                                    alt={user.username}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <svg width="22" height="22" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                            )}
                        </div>
                        <div>
                            <h1 className="text-white font-serif text-xl leading-tight">
                                {[user.firstName, user.lastName].filter(Boolean).join(" ") || user.username}
                            </h1>
                            <p className="text-white/60 text-xs mt-0.5">@{user.username}</p>
                        </div>
                    </div>
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === "admin"
                                ? "bg-white/20 text-white"
                                : "bg-white/10 text-white/70"
                            }`}
                    >
                        {user.role}
                    </span>
                </div>

                {/* Fields */}
                <div className="p-6 grid grid-cols-2 gap-5">
                    <Field label="Email" value={user.email} />
                    <Field label="Phone" value={user.phone} />
                    <Field label="Username" value={`@${user.username}`} />
                    <Field label="Role" value={user.role} />
                    <Field
                        label="Member since"
                        value={
                            user.createdAt
                                ? new Date(user.createdAt).toLocaleDateString("en-NP", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })
                                : undefined
                        }
                    />
                </div>

                {/* Actions */}
                <div className="px-6 pb-6 flex gap-3">
                    <Link
                        href={`/admin/users/${id}/edit`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6B4E4E] text-white text-sm font-semibold hover:bg-[#5A3A3A] transition-colors no-underline"
                    >
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                        Edit User
                    </Link>
                    <Link
                        href="/admin/users"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#E8D4D4] text-[#6B4E4E] text-sm hover:bg-[#F3E6E6] transition-colors no-underline"
                    >
                        ← Back to Users
                    </Link>
                </div>
            </div>
        </div>
    );
}