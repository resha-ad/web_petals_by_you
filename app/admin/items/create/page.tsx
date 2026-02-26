import ItemForm from "@/app/_components/ItemForm";
import { handleCreateItem } from "@/lib/actions/item-action";

export default function CreateItemPage() {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-serif text-[#6B4E4E] mb-8">
                Add New Item
            </h1>

            <div className="bg-white rounded-2xl shadow-xl p-10 border border-rose-100">
                <ItemForm
                    onSubmit={handleCreateItem}
                    buttonText="Create Item"
                />
            </div>
        </div>
    );
}