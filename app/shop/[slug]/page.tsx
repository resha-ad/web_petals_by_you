// app/shop/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import ItemGallery from "@/app/_components/ItemGallery";
import AddToCartButton from "@/app/_components/AddToCartButton";
import FavoritesButton from "@/app/_components/FavoritesButton";

export default async function ItemDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/items/${slug}`,
        { cache: "no-store" }
    );
    if (!res.ok) notFound();

    const data = await res.json();
    const item = data?.data;
    if (!item) notFound();

    const images =
        item.images?.length
            ? item.images.map(
                (img: string) => `${process.env.NEXT_PUBLIC_API_BASE_URL}${img}`
            )
            : ["/images/placeholder-flower.jpg"];

    const finalPrice = item.discountPrice ?? item.price;
    const discountPercent = item.discountPrice
        ? Math.round(((item.price - item.discountPrice) / item.price) * 100)
        : null;
    const isOutOfStock = item.stock !== undefined && item.stock === 0;

    return (
        <div className="min-h-screen bg-[#FBF6F4]">
            {/* Breadcrumb */}
            <div className="max-w-6xl mx-auto px-6 pt-8 pb-2">
                <nav className="flex items-center gap-2 text-xs text-[#9A7A7A]">
                    <Link href="/" className="hover:text-[#6B4E4E] transition">Home</Link>
                    <span className="text-rose-200">/</span>
                    <Link href="/shop" className="hover:text-[#6B4E4E] transition">Shop</Link>
                    <span className="text-rose-200">/</span>
                    <span className="text-[#6B4E4E] font-medium line-clamp-1">{item.name}</span>
                </nav>
            </div>

            {/* Main card */}
            <div className="max-w-6xl mx-auto px-6 py-6">
                <div className="bg-white rounded-3xl shadow-sm border border-rose-50 overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-0">

                        {/* ── Left: Gallery ── */}
                        <div className="p-8 bg-[#FDFAF9] border-r border-rose-50">
                            <ItemGallery images={images} name={item.name} />
                        </div>

                        {/* ── Right: Details ── */}
                        <div className="p-8 md:p-10 flex flex-col">
                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {item.isFeatured && (
                                    <span className="px-3 py-1 rounded-full bg-[#F3E6E6] text-[#6B4E4E] text-xs font-medium">
                                        ✦ Featured
                                    </span>
                                )}
                                {discountPercent && (
                                    <span className="px-3 py-1 rounded-full bg-[#6B4E4E] text-white text-xs font-medium">
                                        {discountPercent}% OFF
                                    </span>
                                )}
                                {isOutOfStock ? (
                                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">
                                        Out of Stock
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                                        ✓ In Stock {item.stock !== undefined && `(${item.stock} available)`}
                                    </span>
                                )}
                            </div>

                            {/* Name */}
                            <h1
                                className="text-3xl md:text-4xl font-serif text-[#6B4E4E] leading-tight mb-3"
                                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                            >
                                {item.name}
                            </h1>

                            {/* Price */}
                            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-rose-50">
                                <span className="text-3xl font-semibold text-[#6B4E4E]">
                                    Rs. {finalPrice.toLocaleString()}
                                </span>
                                {item.discountPrice && (
                                    <span className="text-lg text-[#9A7A7A] line-through">
                                        Rs. {item.price.toLocaleString()}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <p className="text-[#7A6060] text-sm leading-relaxed mb-8">
                                {item.description}
                            </p>

                            {/* Meta info */}
                            <div className="space-y-3 mb-8">
                                {item.category && (
                                    <div className="flex items-center justify-between py-2.5 border-b border-rose-50 text-sm">
                                        <span className="text-[#9A7A7A]">Category</span>
                                        <span className="text-[#6B4E4E] font-medium capitalize">{item.category}</span>
                                    </div>
                                )}
                                {item.preparationTime && (
                                    <div className="flex items-center justify-between py-2.5 border-b border-rose-50 text-sm">
                                        <span className="text-[#9A7A7A] flex items-center gap-1.5">
                                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                            Preparation Time
                                        </span>
                                        <span className="text-[#6B4E4E] font-medium">{item.preparationTime} minutes</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between py-2.5 text-sm">
                                    <span className="text-[#9A7A7A] flex items-center gap-1.5">
                                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
                                        </svg>
                                        Delivery
                                    </span>
                                    <span className="text-emerald-600 font-medium">Available in Kathmandu</span>
                                </div>
                            </div>

                            {/* ── CTA row ── */}
                            <div className="mt-auto">
                                {/*
                                    Layout on md+:  [ qty ][ Add to Cart / View Cart ]  [ ♡ ]
                                    AddToCartButton manages qty+button internally as a flex row.
                                    FavoritesButton is always a fixed 46×46 circle.
                                    The outer div uses items-center so they stay vertically aligned
                                    regardless of whether ATC shows qty stepper or just "View Cart".
                                */}
                                <div className="flex items-center gap-3 w-full">
                                    {/* Takes all remaining space */}
                                    <div className="flex-1 min-w-0">
                                        <AddToCartButton itemId={item._id} isOutOfStock={isOutOfStock} />
                                    </div>

                                    {/* Fixed-size circle — never grows, never shrinks */}
                                    <FavoritesButton itemId={item._id} isOutOfStock={isOutOfStock} />
                                </div>
                            </div>

                            {/* Trust strip */}
                            <div className="mt-6 pt-6 border-t border-rose-50 grid grid-cols-3 gap-3 text-center">
                                {[
                                    { icon: "🌸", label: "Fresh Daily" },
                                    { icon: "📦", label: "Careful Packing" },
                                    { icon: "🚀", label: "Fast Delivery" },
                                ].map(({ icon, label }) => (
                                    <div key={label} className="flex flex-col items-center gap-1">
                                        <span className="text-xl">{icon}</span>
                                        <span className="text-[10px] text-[#9A7A7A] tracking-wide">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back link */}
                <div className="mt-8 text-center">
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 text-sm text-[#9A7A7A] hover:text-[#6B4E4E] transition"
                    >
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                        Back to Shop
                    </Link>
                </div>
            </div>
        </div>
    );
}