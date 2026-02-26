// app/admin/items/[id]/edit/page.tsx
import { notFound } from "next/navigation";
import EditItemForm from "@/app/_components/EditItemForm";
import { handleUpdateItem } from "@/lib/actions/item-action";
import { getItemById } from "@/lib/api/items";

export default async function EditItemPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    let itemResult;
    try {
        itemResult = await getItemById(id);
    } catch (err) {
        notFound();
    }

    if (!itemResult.success || !itemResult.data) {
        notFound();
    }

    const item = itemResult.data;

    // Bind server action with ID
    const updateWithId = handleUpdateItem.bind(null, id);

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-serif text-[#6B4E4E] mb-10">
                Edit Item — {item.name}
            </h1>

            <div className="bg-white rounded-2xl shadow-xl p-10 border border-rose-100">
                <EditItemForm
                    initialData={item}
                    onSubmit={updateWithId}
                    buttonText="Update Item"
                />
            </div>
        </div>
    );
}