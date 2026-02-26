// app/admin/items/page.tsx
import Link from "next/link";
import { handleGetAllItems } from "@/lib/actions/item-action";
import DeleteButton from "@/app/_components/DeleteButton";

export default async function AdminItemsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string }>;
}) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const limit = 10;
    const search = params.search || undefined;

    const result = await handleGetAllItems(page, limit, search);

    if (!result.success) {
        return <div className="text-red-500 p-8 text-center">Error: {result.message}</div>;
    }

    const { items, pagination } = result.data!;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-serif text-[#6B4E4E]">Product Management</h1>
                <Link
                    href="/admin/items/create"
                    className="px-8 py-4 rounded-full bg-[#E8B4B8] text-white hover:bg-[#D9A3A7] transition shadow-md"
                >
                    + Add Product
                </Link>
            </div>

            {/* Search form */}
            <div className="mb-8">
                <form action="/admin/items" method="GET" className="max-w-md">
                    <div className="flex">
                        <input
                            type="text"
                            name="search"
                            defaultValue={search}
                            placeholder="Search by name..."
                            className="flex-1 px-5 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:border-[#E8B4B8]"
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 bg-[#E8B4B8] text-white rounded-r-lg hover:bg-[#D9A3A7]"
                        >
                            Search
                        </button>
                    </div>
                </form>
            </div>

            {items.length === 0 ? (
                <p className="text-center py-12 text-gray-600 text-lg">No products found</p>
            ) : (
                <>
                    <div className="overflow-x-auto bg-white rounded-2xl shadow">
                        <table className="min-w-full">
                            <thead className="bg-rose-50">
                                <tr>
                                    <th className="px-6 py-5 text-left text-sm font-medium text-[#6B4E4E]">Image</th>
                                    <th className="px-6 py-5 text-left text-sm font-medium text-[#6B4E4E]">Name</th>
                                    <th className="px-6 py-5 text-left text-sm font-medium text-[#6B4E4E]">Price</th>
                                    <th className="px-6 py-5 text-left text-sm font-medium text-[#6B4E4E]">Stock</th>
                                    <th className="px-6 py-5 text-left text-sm font-medium text-[#6B4E4E]">Featured</th>
                                    <th className="px-6 py-5 text-left text-sm font-medium text-[#6B4E4E]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item: any) => (
                                    <tr key={item._id} className="border-t hover:bg-rose-50/30 transition">
                                        <td className="px-6 py-4">
                                            {item.images?.[0] ? (
                                                <img
                                                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${item.images[0]}`}
                                                    alt={item.name}
                                                    className="w-16 h-16 object-cover rounded-md"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-xs">
                                                    No img
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-[#6B4E4E]">{item.name}</td>
                                        <td className="px-6 py-4">Rs. {item.price.toLocaleString()}</td>
                                        <td className="px-6 py-4">{item.stock}</td>
                                        <td className="px-6 py-4">
                                            {item.isFeatured ? (
                                                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                    Featured
                                                </span>
                                            ) : (
                                                <span className="text-gray-500">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 flex gap-5">
                                            <Link
                                                href={`/admin/items/${item._id}/view`}
                                                className="text-[#6B4E4E] hover:text-[#E8B4B8] font-medium"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                href={`/admin/items/${item._id}/edit`}
                                                className="text-[#6B4E4E] hover:text-[#E8B4B8] font-medium"
                                            >
                                                Edit
                                            </Link>
                                            <DeleteButton itemId={item._id} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination*/}
                    {pagination.totalPages > 1 && (
                        <div className="mt-10 flex justify-center items-center gap-6">
                            <Link
                                href={`/admin/items?page=${page - 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                                className={`px-6 py-3 rounded-full ${page === 1
                                    ? "bg-gray-200 text-gray-500 pointer-events-none"
                                    : "bg-[#E8B4B8] text-white hover:bg-[#D9A3A7]"
                                    }`}
                                aria-disabled={page === 1}
                            >
                                Previous
                            </Link>

                            <span className="text-lg font-medium text-[#6B4E4E]">
                                Page {page} of {pagination.totalPages}
                            </span>

                            <Link
                                href={`/admin/items?page=${page + 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                                className={`px-6 py-3 rounded-full ${page === pagination.totalPages
                                    ? "bg-gray-200 text-gray-500 pointer-events-none"
                                    : "bg-[#E8B4B8] text-white hover:bg-[#D9A3A7]"
                                    }`}
                                aria-disabled={page === pagination.totalPages}
                            >
                                Next
                            </Link>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}