"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Item = {
    _id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    discountPrice?: number | null;
    images: string[];
    isFeatured?: boolean;
    stock?: number;
};

export default function FeaturedItemCard({ item }: { item: Item }) {
    const [isHovered, setIsHovered] = useState(false);

    const imageUrl = item.images?.[0]
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${item.images[0]}`
        : "/images/placeholder-flower.jpg";

    const secondImageUrl = item.images?.[1]
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${item.images[1]}`
        : null;

    const finalPrice = item.discountPrice ?? item.price;
    const discountPercent = item.discountPrice
        ? Math.round(((item.price - item.discountPrice) / item.price) * 100)
        : null;

    return (
        <Link href={`/shop/${item.slug}`} className="group block">
            <div
                className="relative rounded-3xl overflow-hidden bg-white shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-rose-100/60 hover:-translate-y-2"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image container */}
                <div className="relative h-72 overflow-hidden bg-[#F7EDEB]">
                    {/* Primary image */}
                    <Image
                        src={imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />

                    {/* Secondary image on hover (if exists) */}
                    {secondImageUrl && (
                        <Image
                            src={secondImageUrl}
                            alt={`${item.name} - alternate view`}
                            fill
                            className={`object-cover transition-all duration-700 ${isHovered ? "opacity-100" : "opacity-0"}`}
                            sizes="(max-width: 768px) 100vw, 33vw"
                        />
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Featured badge */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-rose-100 shadow-sm">
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                <path d="M5 1L6.18 3.76L9.24 4.02L7.02 5.97L7.73 9L5 7.4L2.27 9L2.98 5.97L0.76 4.02L3.82 3.76L5 1Z" fill="#E8B4B8" stroke="#C08080" strokeWidth="0.5" />
                            </svg>
                            <span className="text-[10px] font-semibold tracking-wider text-[#6B4E4E] uppercase">Featured</span>
                        </span>

                        {discountPercent && (
                            <span className="inline-flex px-3 py-1.5 rounded-full bg-rose-500 text-white text-[10px] font-bold tracking-wide shadow-sm">
                                {discountPercent}% OFF
                            </span>
                        )}
                    </div>

                    {/* Stock indicator */}
                    {item.stock !== undefined && item.stock <= 5 && item.stock > 0 && (
                        <div className="absolute top-4 right-4">
                            <span className="px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-medium">
                                Only {item.stock} left
                            </span>
                        </div>
                    )}

                    {/* Quick view button — slides up on hover */}
                    <div className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-400 ${isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
                        <div className="flex items-center justify-center gap-2 py-2.5 px-5 rounded-full bg-white/95 backdrop-blur-sm border border-rose-100 shadow-lg">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B4E4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                            <span className="text-xs font-medium text-[#6B4E4E] tracking-wide">View Details</span>
                        </div>
                    </div>
                </div>

                {/* Card body */}
                <div className="p-5">
                    {/* Decorative line */}
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-px flex-1 bg-rose-100" />
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <circle cx="6" cy="6" r="2" fill="#E8B4B8" />
                            <circle cx="6" cy="6" r="1" fill="#C08080" />
                        </svg>
                        <div className="h-px flex-1 bg-rose-100" />
                    </div>

                    <h3 className="font-serif text-lg text-[#6B4E4E] mb-1.5 line-clamp-1 group-hover:text-[#C08080] transition-colors duration-300" style={{ fontFamily: "Georgia, serif" }}>
                        {item.name}
                    </h3>
                    <p className="text-xs text-[#9A7A7A] leading-relaxed line-clamp-2 mb-4">
                        {item.description}
                    </p>

                    {/* Price & CTA row */}
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-[#6B4E4E]">
                                Rs. {finalPrice.toLocaleString()}
                            </span>
                            {item.discountPrice && (
                                <span className="text-xs text-gray-400 line-through -mt-0.5">
                                    Rs. {item.price.toLocaleString()}
                                </span>
                            )}
                        </div>

                        <div className="w-10 h-10 rounded-full border-2 border-rose-100 flex items-center justify-center group-hover:bg-[#6B4E4E] group-hover:border-[#6B4E4E] transition-all duration-300 shadow-sm">
                            <svg
                                width="15" height="15" viewBox="0 0 24 24" fill="none"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                className="stroke-[#C08080] group-hover:stroke-white transition-colors duration-300"
                            >
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}