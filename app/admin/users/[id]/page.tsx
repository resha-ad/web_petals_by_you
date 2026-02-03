import { handleGetUserById } from "@/lib/actions/admin/user-action";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function UserDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const result = await handleGetUserById(id);

    if (!result.success || !result.data) {
        notFound();
    }

    const user = result.data;

    return (
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-4xl mx-auto border border-rose-100">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-serif text-[#6B4E4E]">User Profile</h1>
                <Link
                    href={`/admin/users/${(await (params)).id}/edit`}
                    className="px-8 py-3 rounded-full bg-[#E8B4B8] text-white hover:bg-[#D9A3A7] transition shadow-md"
                >
                    Edit User
                </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {user.imageUrl && (
                    <div className="md:col-span-2 flex justify-center mb-8">
                        <img
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${user.imageUrl}`}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="w-48 h-48 rounded-full object-cover border-4 border-[#E8B4B8]/30 shadow-lg"
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm text-gray-600 font-medium mb-1">Full Name</label>
                    <p className="text-xl text-[#6B4E4E] font-medium">
                        {user.firstName} {user.lastName}
                    </p>
                </div>

                <div>
                    <label className="block text-sm text-gray-600 font-medium mb-1">Username</label>
                    <p className="text-xl text-[#6B4E4E] font-medium">{user.username}</p>
                </div>

                <div>
                    <label className="block text-sm text-gray-600 font-medium mb-1">Email</label>
                    <p className="text-xl text-[#6B4E4E] font-medium">{user.email}</p>
                </div>

                <div>
                    <label className="block text-sm text-gray-600 font-medium mb-1">Role</label>
                    <span
                        className={`inline-block px-4 py-2 rounded-full text-base font-medium ${user.role === "admin" ? "bg-[#E8B4B8] text-white" : "bg-gray-200 text-gray-700"
                            }`}
                    >
                        {user.role}
                    </span>
                </div>

                <div>
                    <label className="block text-sm text-gray-600 font-medium mb-1">Created At</label>
                    <p className="text-xl text-[#6B4E4E] font-medium">
                        {new Date(user.createdAt).toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
}