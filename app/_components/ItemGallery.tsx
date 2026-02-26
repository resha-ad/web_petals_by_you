"use client";

import { useState } from "react";
import Image from "next/image";

export default function ItemGallery({ images, name }: { images: string[]; name: string }) {
    const [active, setActive] = useState(0);
    const [zoomed, setZoomed] = useState(false);

    return (
        <div className="flex flex-col gap-4">
            {/* Main image */}
            <div
                className={`relative aspect-square rounded-2xl overflow-hidden bg-[#F7EDEB] ${zoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                    }`}
                onClick={() => setZoomed(!zoomed)}
            >
                <Image
                    src={images[active]}
                    alt={name}
                    fill
                    className={`object-cover transition-transform duration-500 ${zoomed ? "scale-125" : "scale-100"}`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                />

                {images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setActive((prev) => (prev - 1 + images.length) % images.length);
                            }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#6B4E4E] hover:bg-white transition shadow-sm"
                        >
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setActive((prev) => (prev + 1) % images.length);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#6B4E4E] hover:bg-white transition shadow-sm"
                        >
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </>
                )}

                <div className="absolute bottom-3 right-3 bg-black/30 backdrop-blur-sm text-white text-[10px] px-2.5 py-1 rounded-full">
                    {active + 1} / {images.length}
                </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                    {images.map((src, i) => (
                        <button
                            key={i}
                            onClick={() => setActive(i)}
                            className={`relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${i === active
                                    ? "border-[#6B4E4E] shadow-md"
                                    : "border-transparent hover:border-[#E8B4B8]"
                                }`}
                        >
                            <Image src={src} alt={`${name} view ${i + 1}`} fill className="object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}