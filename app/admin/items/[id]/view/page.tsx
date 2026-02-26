// app/admin/items/[id]/view/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import { getItemById } from "@/lib/api/items";
import Link from "next/link";

export default async function ViewItemPage({
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

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-serif text-[#6B4E4E]">Bouquet Details (Admin Log)</h1>
                <div className="flex gap-4">
                    <Link
                        href={`/admin/items/${id}/edit`}
                        className="px-6 py-3 bg-[#E8B4B8] text-white rounded-full hover:bg-[#D9A3A7]"
                    >
                        Edit
                    </Link>
                    <Link
                        href="/admin/items"
                        className="px-6 py-3 border border-[#6B4E4E] text-[#6B4E4E] rounded-full hover:bg-rose-50"
                    >
                        ← Back to List
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                {/* Images */}
                <div className="p-8 bg-rose-50">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {item.images?.length > 0 ? (
                            item.images.map((img: string, i: number) => (
                                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border">
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${img}`}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                No images uploaded
                            </div>
                        )}
                    </div>
                </div>

                {/* Details */}
                <div className="p-10 grid md:grid-cols-2 gap-10">
                    <div>
                        <h2 className="text-3xl font-serif text-[#6B4E4E] mb-6">{item.name}</h2>
                        <p className="text-4xl font-bold text-[#E8B4B8]">
                            Rs. {(item.discountPrice ?? item.price).toLocaleString()}
                            {item.discountPrice && (
                                <span className="text-xl text-gray-500 line-through ml-4">
                                    Rs. {item.price.toLocaleString()}
                                </span>
                            )}
                        </p>

                        <div className="mt-8 space-y-4 text-lg">
                            <div><span className="font-medium text-gray-600">Slug:</span> {item.slug}</div>
                            <div><span className="font-medium text-gray-600">Category:</span> {item.category || "—"}</div>
                            <div><span className="font-medium text-gray-600">Stock:</span> {item.stock}</div>
                            <div><span className="font-medium text-gray-600">Featured:</span> {item.isFeatured ? "Yes" : "No"}</div>
                            <div><span className="font-medium text-gray-600">Available:</span> {item.isAvailable ? "Yes" : "No"}</div>
                            <div><span className="font-medium text-gray-600">Preparation Time:</span> {item.preparationTime || "—"} min</div>
                            <div><span className="font-medium text-gray-600">Delivery Type:</span> {item.deliveryType || "—"}</div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-600 mb-3">Description</h3>
                        <p className="text-gray-700 leading-relaxed">{item.description}</p>

                        <div className="mt-10 pt-8 border-t">
                            <h3 className="font-medium text-gray-600 mb-4">Admin Log</h3>
                            <div className="space-y-3 text-sm">
                                <div><strong>Created By:</strong> {item.createdBy?.username || item.createdBy?.email || "—"}</div>
                                <div><strong>Created At:</strong> {new Date(item.createdAt).toLocaleString()}</div>
                                <div><strong>Last Updated:</strong> {new Date(item.updatedAt).toLocaleString()}</div>
                                <div><strong>Mongo ID:</strong> {item._id}</div>
                                <div><strong>Is Deleted:</strong> {item.isDeleted ? "Yes" : "No"}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}