// app/admin/items/page.tsx
import Link from "next/link";
import { handleGetAllItems } from "@/lib/actions/item-action";
import DeleteButton from "@/app/_components/DeleteButton";

const CATEGORIES = [
    "All", "bouquets", "flowers", "arrangements", "gifts", "others",
];

export default async function AdminItemsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string; category?: string }>;
}) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const limit = 10;
    const search = params.search || undefined;
    const category = (params.category && params.category !== "All") ? params.category : undefined;

    // ✅ Now accepts 4 args — category param added to the action
    const result = await handleGetAllItems(page, limit, search, category);

    if (!result.success) {
        return (
            <div className="flex items-center justify-center py-20 text-sm text-red-500">
                Error: {result.message}
            </div>
        );
    }

    const { items, pagination } = result.data!;
    const activeCategory = params.category || "All";

    const buildHref = (overrides: { page?: number; category?: string; search?: string }) => {
        const p = overrides.page ?? page;
        const cat = "category" in overrides ? overrides.category : activeCategory;
        const q = "search" in overrides ? overrides.search : search;
        const parts: string[] = [`page=${p}`];
        if (cat && cat !== "All") parts.push(`category=${encodeURIComponent(cat)}`);
        if (q) parts.push(`search=${encodeURIComponent(q)}`);
        return `/admin/items?${parts.join("&")}`;
    };

    return (
        <div className="max-w-6xl mx-auto">

            {/* ── Header ── */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="font-serif text-[#6B4E4E] text-2xl mb-0.5">Products</h1>
                    <p className="text-[#9A7A7A] text-xs">
                        {pagination?.total ?? items.length} product{(pagination?.total ?? items.length) !== 1 ? "s" : ""} total
                    </p>
                </div>
                <Link
                    href="/admin/items/create"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6B4E4E] text-white text-sm font-semibold hover:bg-[#5A3A3A] transition-colors shadow-sm no-underline"
                >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Product
                </Link>
            </div>

            {/* ── Search + Category ── */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5 flex-wrap">
                <form action="/admin/items" method="GET" className="flex">
                    {activeCategory !== "All" && (
                        <input type="hidden" name="category" value={activeCategory} />
                    )}
                    <div className="flex border border-[#E8D4D4] rounded-full overflow-hidden bg-white shadow-sm">
                        <div className="flex items-center pl-4 text-[#C4A0A0]">
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            name="search"
                            defaultValue={search}
                            placeholder="Search products…"
                            className="px-3 py-2 text-sm text-[#6B4E4E] outline-none bg-transparent placeholder:text-[#C0B0B0] w-52"
                        />
                        <button type="submit" className="px-4 py-2 bg-[#6B4E4E] text-white text-xs font-semibold hover:bg-[#5A3A3A] transition-colors">
                            Search
                        </button>
                    </div>
                </form>

                <div className="flex gap-1.5 flex-wrap items-center">
                    {CATEGORIES.map((cat) => {
                        const isActive = activeCategory === cat;
                        return (
                            <Link
                                key={cat}
                                href={buildHref({ category: cat, page: 1 })}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize no-underline ${isActive
                                        ? "bg-[#6B4E4E] text-white"
                                        : "bg-white border border-[#E8D4D4] text-[#9A7A7A] hover:bg-[#F3E6E6] hover:text-[#6B4E4E]"
                                    }`}
                            >
                                {cat}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* ── Table ── */}
            {items.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#F3E6E6] p-16 text-center text-[#9A7A7A] text-sm">
                    <div className="w-12 h-12 rounded-full bg-[#F3E6E6] flex items-center justify-center mx-auto mb-3">
                        <svg width="20" height="20" fill="none" stroke="#C4A0A0" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
                        </svg>
                    </div>
                    No products found.
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-[#F3E6E6] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr className="bg-[#FBF6F4] border-b-2 border-[#F3E6E6]">
                                    {["Product", "Category", "Price", "Stock", "Status", "Featured", "Actions"].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-[0.68rem] font-bold text-[#9A7A7A] uppercase tracking-wider whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item: any, idx: number) => (
                                    <tr
                                        key={item._id}
                                        className={`hover:bg-[#FBF6F4] transition-colors ${idx < items.length - 1 ? "border-b border-[#F9F0EE]" : ""}`}
                                    >
                                        {/* Product */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 rounded-xl bg-[#F3E6E6] overflow-hidden flex-shrink-0 border border-[#EDD8D8]">
                                                    {item.images?.[0] ? (
                                                        <img
                                                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${item.images[0]}`}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <svg width="14" height="14" fill="none" stroke="#C4A0A0" strokeWidth="1.5" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-[#6B4E4E] text-sm leading-tight max-w-[150px] truncate">{item.name}</p>
                                                    <p className="text-[#B0A0A0] text-[0.65rem] mt-0.5 font-mono">{item._id.slice(-8)}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Category */}
                                        <td className="px-4 py-3">
                                            {item.category ? (
                                                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F3E6E6] text-[#6B4E4E] text-[0.68rem] font-medium capitalize">
                                                    {item.category}
                                                </span>
                                            ) : (
                                                <span className="text-[#C0B0B0] text-xs">—</span>
                                            )}
                                        </td>

                                        {/* Price */}
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-[#6B4E4E] text-sm">
                                                    Rs.&nbsp;{(item.discountPrice ?? item.price).toLocaleString()}
                                                </span>
                                                {item.discountPrice && (
                                                    <span className="text-[0.65rem] text-[#C0B0B0] line-through">
                                                        Rs.&nbsp;{item.price.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Stock */}
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1 text-xs font-medium ${item.stock === 0 ? "text-red-500" : item.stock <= 5 ? "text-amber-600" : "text-[#7A6060]"
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.stock === 0 ? "bg-red-400" : item.stock <= 5 ? "bg-amber-400" : "bg-green-400"
                                                    }`} />
                                                {item.stock}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.68rem] font-semibold ${item.isAvailable ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${item.isAvailable ? "bg-green-500" : "bg-gray-400"}`} />
                                                {item.isAvailable ? "Available" : "Hidden"}
                                            </span>
                                        </td>

                                        {/* Featured */}
                                        <td className="px-4 py-3">
                                            {item.isFeatured ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F3E6E6] text-[#6B4E4E] text-[0.68rem] font-semibold">
                                                    <svg width="9" height="9" viewBox="0 0 24 24" fill="#E8B4B8" stroke="#C08080" strokeWidth="1">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                                    </svg>
                                                    Featured
                                                </span>
                                            ) : (
                                                <span className="text-[#C0B0B0] text-xs">—</span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Link href={`/admin/items/${item._id}/view`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E8D4D4] text-[#6B4E4E] text-xs hover:bg-[#F3E6E6] transition-colors no-underline">
                                                    <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                    </svg>
                                                    View
                                                </Link>
                                                <Link href={`/admin/items/${item._id}/edit`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E8D4D4] text-[#6B4E4E] text-xs hover:bg-[#F3E6E6] transition-colors no-underline">
                                                    <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                                                    </svg>
                                                    Edit
                                                </Link>
                                                <DeleteButton itemId={item._id} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── Pagination ── */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                    <Link
                        href={buildHref({ page: page - 1 })}
                        className={`px-5 py-2 rounded-full border border-[#E8D4D4] bg-white text-[#6B4E4E] text-sm transition-colors no-underline ${page === 1 ? "opacity-40 pointer-events-none" : "hover:bg-[#F3E6E6]"
                            }`}
                        aria-disabled={page === 1}
                    >
                        ← Previous
                    </Link>
                    <span className="text-sm text-[#9A7A7A]">Page {page} of {pagination.totalPages}</span>
                    <Link
                        href={buildHref({ page: page + 1 })}
                        className={`px-5 py-2 rounded-full border border-[#E8D4D4] bg-white text-[#6B4E4E] text-sm transition-colors no-underline ${page === pagination.totalPages ? "opacity-40 pointer-events-none" : "hover:bg-[#F3E6E6]"
                            }`}
                        aria-disabled={page === pagination.totalPages}
                    >
                        Next →
                    </Link>
                </div>
            )}
        </div>
    );
}