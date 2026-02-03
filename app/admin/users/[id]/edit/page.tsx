import { handleGetUserById } from "@/lib/actions/admin/user-action";
import { notFound } from "next/navigation";
import EditUserForm from "../../_components/EditUserForm";

export default async function EditUserPage({
    params,
}: {
    params: Promise<{ id: string }>;  // ← note: Promise here
}) {
    // Await the params Promise
    const { id } = await params;   // ← this unwraps it

    const result = await handleGetUserById(id);

    if (!result.success || !result.data) {
        notFound();
    }

    return (
        <div className="p-8">
            <h1 className="text-4xl font-serif text-[#6B4E4E] mb-10">
                Edit User: {result.data.username}
            </h1>
            <div className="bg-white rounded-2xl shadow-xl p-10 max-w-3xl mx-auto border border-rose-100">
                <EditUserForm user={result.data} />
            </div>
        </div>
    );
}