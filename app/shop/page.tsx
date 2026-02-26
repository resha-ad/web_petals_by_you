import ItemCard from "@/app/_components/ItemCard";
import Link from "next/link";

const CATEGORIES = [
    { value: "", label: "All Items" },
    { value: "bouquets", label: "Bouquets" },
    { value: "flowers", label: "Flowers" },
    { value: "arrangements", label: "Arrangements" },
    { value: "gifts", label: "Gift Sets" },
];

export default async function ShopPage({
    searchParams,
}: {
    searchParams: Promise<{
        page?: string;
        search?: string;
        category?: string;
        minPrice?: string;
        maxPrice?: string;
        featured?: string;
    }>;
}) {
    const params = await searchParams;

    const page = Number(params.page) || 1;
    const limit = 12;

    const query = new URLSearchParams();
    query.set("page", page.toString());
    query.set("limit", limit.toString());
    if (params.search) query.set("search", params.search);
    if (params.category) query.set("category", params.category);
    if (params.minPrice) query.set("minPrice", params.minPrice);
    if (params.maxPrice) query.set("maxPrice", params.maxPrice);
    if (params.featured) query.set("featured", params.featured);

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/items?${query}`,
        { cache: "no-store" }
    );

    if (!res.ok) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FBF6F4]">
                <div className="text-center">
                    <div className="text-5xl mb-4">🌸</div>
                    <p className="text-[#6B4E4E] font-serif text-xl">Unable to load our collection right now.</p>
                    <p className="text-[#9A7A7A] text-sm mt-2">Please try again in a moment.</p>
                </div>
            </div>
        );
    }

    const json = await res.json();
    const items = json?.data?.items || [];
    const pagination = json?.data?.pagination || { page: 1, totalPages: 1, total: 0 };

    // Build URL helper for filter/pagination links
    const buildUrl = (overrides: Record<string, string | undefined>) => {
        const merged = {
            search: params.search,
            category: params.category,
            minPrice: params.minPrice,
            maxPrice: params.maxPrice,
            featured: params.featured,
            page: page.toString(),
            ...overrides,
        };
        const q = new URLSearchParams();
        Object.entries(merged).forEach(([k, v]) => {
            if (v) q.set(k, v);
        });
        return `/shop?${q.toString()}`;
    };

    const activeCategory = params.category || "";

    return (
        <div className="min-h-screen bg-[#FBF6F4]">
            {/* ── Hero Banner ── */}
            <div
                className="relative py-16 px-6 text-center overflow-hidden"
                style={{ background: "linear-gradient(160deg, #F3E6E6 0%, #EDD5D5 60%, #E4C8C8 100%)" }}
            >
                {/* Decorative petals */}
                {["🌸", "🌺", "🌷", "🌹", "💐"].map((p, i) => (
                    <span
                        key={i}
                        className="absolute select-none pointer-events-none text-4xl opacity-15"
                        style={{
                            left: `${5 + i * 22}%`,
                            top: `${20 + (i % 3) * 25}%`,
                            transform: `rotate(${i * 30 - 30}deg)`,
                        }}
                    >
                        {p}
                    </span>
                ))}

                <p className="text-xs tracking-[0.25em] uppercase text-[#C08080] mb-3">✦ Fresh Daily ✦</p>
                <h1
                    className="text-4xl md:text-6xl font-serif text-[#6B4E4E] mb-4"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                    Our Collection
                </h1>
                <p className="text-[#9A7A7A] max-w-md mx-auto text-sm leading-relaxed">
                    Handpicked blooms for every occasion — from intimate gifts to grand celebrations.
                </p>

                {/* ── Search Bar ── */}
                <form
                    method="GET"
                    action="/shop"
                    className="mt-8 flex items-center gap-0 max-w-lg mx-auto bg-white rounded-full shadow-md shadow-rose-100 overflow-hidden border border-rose-100"
                >
                    <input type="hidden" name="category" value={activeCategory} />
                    <div className="pl-5 text-[#C08080]">
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        name="search"
                        placeholder="Search bouquets, flowers..."
                        defaultValue={params.search || ""}
                        className="flex-1 px-4 py-3.5 text-sm text-[#6B4E4E] placeholder-[#C4A0A0] bg-transparent focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="px-6 py-3.5 bg-[#6B4E4E] text-white text-sm font-medium hover:bg-[#5a3f3f] transition-colors duration-200"
                    >
                        Search
                    </button>
                </form>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10">
                {/* ── Filters Row ── */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    {/* Category pills */}
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((cat) => (
                            <Link
                                key={cat.value}
                                href={buildUrl({ category: cat.value || undefined, page: "1" })}
                                className={`px-5 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-200 border ${activeCategory === cat.value
                                        ? "bg-[#6B4E4E] text-white border-[#6B4E4E] shadow-sm"
                                        : "bg-white text-[#9A7A7A] border-rose-100 hover:border-[#E8B4B8] hover:text-[#6B4E4E]"
                                    }`}
                            >
                                {cat.label}
                            </Link>
                        ))}
                    </div>

                    {/* Result count + Featured toggle */}
                    <div className="flex items-center gap-4 shrink-0">
                        {pagination.total > 0 && (
                            <span className="text-xs text-[#9A7A7A]">
                                {pagination.total} item{pagination.total !== 1 ? "s" : ""}
                            </span>
                        )}
                        <Link
                            href={buildUrl({ featured: params.featured ? undefined : "true", page: "1" })}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs border transition-all duration-200 ${params.featured
                                    ? "bg-[#E8B4B8] text-white border-[#E8B4B8]"
                                    : "bg-white text-[#9A7A7A] border-rose-100 hover:border-[#E8B4B8]"
                                }`}
                        >
                            <span>✦</span> Featured
                        </Link>
                    </div>
                </div>

                {/* ── Active Filters strip ── */}
                {(params.search || params.category || params.featured) && (
                    <div className="flex flex-wrap items-center gap-2 mb-6 pb-6 border-b border-rose-100">
                        <span className="text-xs text-[#9A7A7A]">Active filters:</span>
                        {params.search && (
                            <Link
                                href={buildUrl({ search: undefined, page: "1" })}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3E6E6] text-[#6B4E4E] text-xs hover:bg-rose-200 transition"
                            >
                                Search: "{params.search}" <span className="text-[#C08080]">×</span>
                            </Link>
                        )}
                        {params.category && (
                            <Link
                                href={buildUrl({ category: undefined, page: "1" })}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3E6E6] text-[#6B4E4E] text-xs hover:bg-rose-200 transition"
                            >
                                {CATEGORIES.find((c) => c.value === params.category)?.label} <span className="text-[#C08080]">×</span>
                            </Link>
                        )}
                        {params.featured && (
                            <Link
                                href={buildUrl({ featured: undefined, page: "1" })}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3E6E6] text-[#6B4E4E] text-xs hover:bg-rose-200 transition"
                            >
                                Featured only <span className="text-[#C08080]">×</span>
                            </Link>
                        )}
                        <Link
                            href="/shop"
                            className="text-xs text-[#C08080] underline underline-offset-2 hover:text-[#6B4E4E] transition"
                        >
                            Clear all
                        </Link>
                    </div>
                )}

                {/* ── Grid / Empty State ── */}
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="text-6xl mb-5 opacity-50">🌿</div>
                        <h3 className="font-serif text-2xl text-[#6B4E4E] mb-2">No flowers found</h3>
                        <p className="text-sm text-[#9A7A7A] mb-6 max-w-xs">
                            We couldn't find any items matching your search. Try different keywords or browse all items.
                        </p>
                        <Link
                            href="/shop"
                            className="px-7 py-3 rounded-full bg-[#6B4E4E] text-white text-sm hover:bg-[#5a3f3f] transition"
                        >
                            Browse All
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {items.map((item: any, i: number) => (
                            <div
                                key={item._id}
                                style={{ animationDelay: `${i * 40}ms` }}
                                className="animate-fade-up"
                            >
                                <ItemCard item={item} />
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Pagination ── */}
                {pagination.totalPages > 1 && (
                    <div className="mt-14 flex items-center justify-center gap-2 flex-wrap">
                        {/* Prev */}
                        {page > 1 ? (
                            <Link
                                href={buildUrl({ page: String(page - 1) })}
                                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white border border-rose-100 text-[#6B4E4E] text-sm hover:bg-[#F3E6E6] hover:border-[#E8B4B8] transition"
                            >
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                </svg>
                                Prev
                            </Link>
                        ) : (
                            <span className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white border border-rose-100 text-[#C4A0A0] text-sm cursor-not-allowed opacity-50">
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                </svg>
                                Prev
                            </span>
                        )}

                        {/* Page numbers */}
                        <div className="flex items-center gap-1">
                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                .filter((p) => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1)
                                .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                                    acc.push(p);
                                    return acc;
                                }, [])
                                .map((p, i) =>
                                    p === "..." ? (
                                        <span key={`ellipsis-${i}`} className="px-2 text-[#C08080] text-sm">…</span>
                                    ) : (
                                        <Link
                                            key={p}
                                            href={buildUrl({ page: String(p) })}
                                            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all duration-200 ${p === page
                                                    ? "bg-[#6B4E4E] text-white shadow-sm"
                                                    : "bg-white border border-rose-100 text-[#9A7A7A] hover:bg-[#F3E6E6] hover:text-[#6B4E4E]"
                                                }`}
                                        >
                                            {p}
                                        </Link>
                                    )
                                )}
                        </div>

                        {/* Next */}
                        {page < pagination.totalPages ? (
                            <Link
                                href={buildUrl({ page: String(page + 1) })}
                                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white border border-rose-100 text-[#6B4E4E] text-sm hover:bg-[#F3E6E6] hover:border-[#E8B4B8] transition"
                            >
                                Next
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </Link>
                        ) : (
                            <span className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white border border-rose-100 text-[#C4A0A0] text-sm cursor-not-allowed opacity-50">
                                Next
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </span>
                        )}
                    </div>
                )}
            </div>

        </div>
    );
}