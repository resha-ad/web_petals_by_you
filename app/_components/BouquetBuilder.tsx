"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_contexts/AuthContext";
import router from "next/router";
import { addCustomBouquetToCartAction } from "@/lib/actions/custom-bouquet-actions";
import { toast } from "react-toastify";

// ─── Data ──────────────────────────────────────────────────────────────────────

const FLOWERS = [
    {
        id: "rose",
        name: "Rose",
        tagline: "Classic & romantic",
        price: 120,
        color: "#F9A8D4",
        shadowColor: "#f472b640",
        img: "/images/singlerose.jpg",
    },
    {
        id: "tulip",
        name: "Tulip",
        tagline: "Elegant & graceful",
        price: 90,
        color: "#FCA5A5",
        shadowColor: "#fb923c40",
        img: "/images/singletulip.jpg",
    },
    {
        id: "sunflower",
        name: "Sunflower",
        tagline: "Bright & cheerful",
        price: 80,
        color: "#FDE68A",
        shadowColor: "#fbbf2440",
        img: "/images/singlesunflower2.jpg",
    },
    {
        id: "lily",
        name: "Lily",
        tagline: "Pure & serene",
        price: 110,
        color: "#C4B5FD",
        shadowColor: "#a78bfa40",
        img: "/images/singlelily.jpg",
    },
    {
        id: "daisy",
        name: "Daisy",
        tagline: "Sweet & playful",
        price: 70,
        color: "#FEF08A",
        shadowColor: "#facc1540",
        img: "/images/singledaisy2.jpg",
    },
    {
        id: "orchid",
        name: "Orchid",
        tagline: "Exotic & mysterious",
        price: 180,
        color: "#E879F9",
        shadowColor: "#d946ef40",
        img: "/images/singleorchid.jpg",
    },
    {
        id: "peony",
        name: "Peony",
        tagline: "Lush & romantic",
        price: 150,
        color: "#FCA5A5",
        shadowColor: "#f4366040",
        img: "/images/singlepeony4.jpg",
    },
    {
        id: "lavender",
        name: "Lavender",
        tagline: "Calm & fragrant",
        price: 85,
        color: "#A78BFA",
        shadowColor: "#818cf840",
        img: "/images/singlelavender2.jpg",
    },
];

const WRAPPINGS = [
    {
        id: "kraft",
        name: "Kraft Paper",
        tagline: "Rustic & natural",
        price: 50,
        color: "#D4A574",
        darkColor: "#92400e",
        img: "/images/kraft.jpg",
    },
    {
        id: "silk",
        name: "Silk Ribbon",
        tagline: "Elegant & luxurious",
        price: 120,
        color: "#F9A8D4",
        darkColor: "#9d174d",
        img: "/images/silk.jpg",
    },
    {
        id: "burlap",
        name: "Burlap & Twine",
        tagline: "Earthy & charming",
        price: 70,
        color: "#A3B899",
        darkColor: "#14532d",
        img: "/images/burlap.jpg",
    },
    {
        id: "velvet",
        name: "Velvet Wrap",
        tagline: "Rich & opulent",
        price: 150,
        color: "#A78BFA",
        darkColor: "#4c1d95",
        img: "/images/velvet.jpg",
    },
    {
        id: "lace",
        name: "Lace & Pearl",
        tagline: "Romantic & delicate",
        price: 130,
        color: "#FDF4FF",
        darkColor: "#701a75",
        img: "/images/lace.jpg",
    },
    {
        id: "minimal",
        name: "Minimal White",
        tagline: "Clean & modern",
        price: 40,
        color: "#F1F5F9",
        darkColor: "#334155",
        img: "/images/white.jpg",
    },
];

const STEPS = [
    { id: 1, label: "Flowers", icon: "🌸" },
    { id: 2, label: "Count", icon: "🔢" },
    { id: 3, label: "Wrapping", icon: "🎀" },
    { id: 4, label: "Message", icon: "💌" },
    { id: 5, label: "Review", icon: "✨" },
];

type FlowerSelection = { id: string; count: number };
interface BouquetState {
    flowers: FlowerSelection[];
    wrapping: string;
    note: string;
    recipientName: string;
}

// ─── Step Bar ──────────────────────────────────────────────────────────────────

function StepBar({ current }: { current: number }) {
    return (
        <div className="flex items-center justify-center gap-0 mb-10">
            {STEPS.map((step, idx) => (
                <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center gap-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-500 border-2 ${current === step.id
                            ? "bg-[#6B4E4E] border-[#6B4E4E] text-white scale-110 shadow-lg shadow-rose-200"
                            : current > step.id
                                ? "bg-[#E8B4B8] border-[#E8B4B8] text-white"
                                : "bg-white border-rose-100 text-[#C4A0A0]"
                            }`}>
                            {current > step.id ? "✓" : step.icon}
                        </div>
                        <span className={`text-[9px] tracking-widest uppercase font-medium transition-colors duration-300 ${current === step.id ? "text-[#6B4E4E]" : "text-[#C4A0A0]"}`}>
                            {step.label}
                        </span>
                    </div>
                    {idx < STEPS.length - 1 && (
                        <div className={`w-10 h-px mx-1 mb-5 transition-all duration-500 ${current > step.id ? "bg-[#E8B4B8]" : "bg-rose-100"}`} />
                    )}
                </div>
            ))}
        </div>
    );
}

// ─── SVG Botanical Flower Illustrations ───────────────────────────────────────

function FlowerSVG({ id, size = 56 }: { id: string; size?: number }) {
    const s = size;
    switch (id) {
        case "rose":
            return (
                <svg width={s} height={s} viewBox="0 0 56 56" fill="none">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
                        <ellipse key={i} cx="28" cy="13" rx="7" ry="12" fill={i % 2 === 0 ? "#FECDD3" : "#FDA4AF"} opacity="0.8" transform={`rotate(${a} 28 28)`} />
                    ))}
                    {[22, 82, 142, 202, 262, 322].map((a, i) => (
                        <ellipse key={i} cx="28" cy="17" rx="5.5" ry="9" fill={i % 2 === 0 ? "#FB7185" : "#F43F5E"} opacity="0.88" transform={`rotate(${a} 28 28)`} />
                    ))}
                    <circle cx="28" cy="28" r="8" fill="#E11D48" />
                    <circle cx="28" cy="28" r="5.5" fill="#F43F5E" />
                    <circle cx="26" cy="26" r="2" fill="#FECDD3" opacity="0.55" />
                </svg>
            );
        case "tulip":
            return (
                <svg width={s} height={s} viewBox="0 0 56 56" fill="none">
                    <path d="M28 40 Q13 28 15 13 Q22 8 28 20 Z" fill="#FCA5A5" opacity="0.9" />
                    <path d="M28 40 Q43 28 41 13 Q34 8 28 20 Z" fill="#F87171" opacity="0.85" />
                    <path d="M28 40 Q19 22 28 8 Q37 22 28 40 Z" fill="#EF4444" opacity="0.95" />
                    <path d="M28 37 Q22 23 28 12 Q30 20 28 37 Z" fill="#FCA5A5" opacity="0.45" />
                    <path d="M23 40 Q28 44 33 40 Q28 37 23 40Z" fill="#4ADE80" />
                </svg>
            );
        case "sunflower":
            return (
                <svg width={s} height={s} viewBox="0 0 56 56" fill="none">
                    {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((a, i) => (
                        <ellipse key={i} cx="28" cy="10" rx="3.5" ry="9" fill={i % 2 === 0 ? "#FDE68A" : "#FCD34D"} opacity="0.95" transform={`rotate(${a} 28 28)`} />
                    ))}
                    <circle cx="28" cy="28" r="11" fill="#92400E" />
                    <circle cx="28" cy="28" r="9" fill="#78350F" />
                    {[0, 60, 120, 180, 240, 300].map((a, i) => (
                        <circle key={i} cx={28 + Math.cos(a * Math.PI / 180) * 5} cy={28 + Math.sin(a * Math.PI / 180) * 5} r="1.3" fill="#451A03" opacity="0.65" />
                    ))}
                    {[30, 90, 150, 210, 270, 330].map((a, i) => (
                        <circle key={i} cx={28 + Math.cos(a * Math.PI / 180) * 2.5} cy={28 + Math.sin(a * Math.PI / 180) * 2.5} r="1" fill="#451A03" opacity="0.5" />
                    ))}
                    <circle cx="28" cy="28" r="1.3" fill="#451A03" opacity="0.6" />
                    <circle cx="25" cy="25" r="2.2" fill="#A16207" opacity="0.25" />
                </svg>
            );
        case "lily":
            return (
                <svg width={s} height={s} viewBox="0 0 56 56" fill="none">
                    {[0, 60, 120, 180, 240, 300].map((a, i) => (
                        <ellipse key={i} cx="28" cy="12" rx="5" ry="14" fill={i % 2 === 0 ? "#DDD6FE" : "#C4B5FD"} opacity="0.88" transform={`rotate(${a} 28 28)`} />
                    ))}
                    {[0, 60, 120, 180, 240, 300].map((a, i) => (
                        <line key={i} x1="28" y1="15" x2="28" y2="26" stroke="#7C3AED" strokeWidth="0.6" opacity="0.28" transform={`rotate(${a} 28 28)`} />
                    ))}
                    <circle cx="28" cy="28" r="5.5" fill="#7C3AED" />
                    {[0, 60, 120, 180, 240, 300].map((a, i) => {
                        const r = a * Math.PI / 180;
                        return <circle key={i} cx={28 + Math.cos(r) * 7.5} cy={28 + Math.sin(r) * 7.5} r="1.4" fill="#FBBF24" />;
                    })}
                    <circle cx="28" cy="28" r="2.8" fill="#A78BFA" />
                    <circle cx="27" cy="27" r="1.1" fill="white" opacity="0.5" />
                </svg>
            );
        case "daisy":
            return (
                <svg width={s} height={s} viewBox="0 0 56 56" fill="none">
                    {[0, 24, 48, 72, 96, 120, 144, 168, 192, 216, 240, 264, 288, 312, 336].map((a, i) => (
                        <ellipse key={i} cx="28" cy="11" rx="3" ry="10" fill="white" stroke="#E5E7EB" strokeWidth="0.3" opacity="0.95" transform={`rotate(${a} 28 28)`} />
                    ))}
                    {[12, 36, 60, 84, 108, 132, 156, 180, 204, 228, 252, 276, 300, 324, 348].map((a, i) => (
                        <ellipse key={i} cx="28" cy="13.5" rx="2.5" ry="8" fill="#F1F5F9" opacity="0.7" transform={`rotate(${a} 28 28)`} />
                    ))}
                    <circle cx="28" cy="28" r="9" fill="#FDE68A" />
                    <circle cx="28" cy="28" r="7.5" fill="#FCD34D" />
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
                        <circle key={i} cx={28 + Math.cos(a * Math.PI / 180) * 4.5} cy={28 + Math.sin(a * Math.PI / 180) * 4.5} r="1.1" fill="#F59E0B" opacity="0.65" />
                    ))}
                    <circle cx="28" cy="28" r="2.8" fill="#D97706" />
                    <circle cx="26.5" cy="26.5" r="1.3" fill="#FEF3C7" opacity="0.55" />
                </svg>
            );
        case "orchid":
            return (
                <svg width={s} height={s} viewBox="0 0 56 56" fill="none">
                    <path d="M28 7 Q21 16 21 25 Q28 20 35 25 Q35 16 28 7Z" fill="#F0ABFC" opacity="0.88" />
                    <path d="M28 24 Q13 17 9 28 Q15 35 28 31Z" fill="#E879F9" opacity="0.82" />
                    <path d="M28 24 Q43 17 47 28 Q41 35 28 31Z" fill="#E879F9" opacity="0.82" />
                    <path d="M28 31 Q17 35 15 46 Q24 44 28 37Z" fill="#D946EF" opacity="0.78" />
                    <path d="M28 31 Q39 35 41 46 Q32 44 28 37Z" fill="#D946EF" opacity="0.78" />
                    <path d="M22 28 Q28 42 34 28 Q31 23 28 26 Q25 23 22 28Z" fill="#A21CAF" />
                    <ellipse cx="28" cy="26" rx="3.2" ry="4.2" fill="#FAE8FF" />
                    <ellipse cx="28" cy="25" rx="2.2" ry="2.8" fill="#E879F9" />
                    <circle cx="28" cy="23.5" r="1.6" fill="#FBBF24" />
                </svg>
            );
        case "peony":
            return (
                <svg width={s} height={s} viewBox="0 0 56 56" fill="none">
                    {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((a, i) => (
                        <ellipse key={i} cx="28" cy="9" rx="7" ry="15" fill="#FECDD3" opacity="0.72" transform={`rotate(${a} 28 28)`} />
                    ))}
                    {[18, 54, 90, 126, 162, 198, 234, 270, 306, 342].map((a, i) => (
                        <ellipse key={i} cx="28" cy="12" rx="6" ry="13" fill="#FDA4AF" opacity="0.78" transform={`rotate(${a} 28 28)`} />
                    ))}
                    {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((a, i) => (
                        <ellipse key={i} cx="28" cy="16" rx="5" ry="10" fill="#FB7185" opacity="0.84" transform={`rotate(${a} 28 28)`} />
                    ))}
                    {[20, 65, 110, 155, 200, 245, 290, 335].map((a, i) => (
                        <ellipse key={i} cx="28" cy="20" rx="4" ry="8" fill="#F43F5E" opacity="0.9" transform={`rotate(${a} 28 28)`} />
                    ))}
                    <circle cx="28" cy="28" r="7.5" fill="#E11D48" />
                    <circle cx="28" cy="28" r="5.5" fill="#F43F5E" />
                    <circle cx="28" cy="28" r="3.2" fill="#FB7185" />
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
                        <circle key={i} cx={28 + Math.cos(a * Math.PI / 180) * 5} cy={28 + Math.sin(a * Math.PI / 180) * 5} r="1" fill="#FDE68A" />
                    ))}
                    <circle cx="26" cy="26" r="1.6" fill="#FECDD3" opacity="0.45" />
                </svg>
            );
        case "lavender":
            return (
                <svg width={s} height={s} viewBox="0 0 56 56" fill="none">
                    {[
                        { y: 9, w: 4.5, h: 4 }, { y: 14, w: 5.5, h: 4.5 }, { y: 19.5, w: 6.5, h: 5 },
                        { y: 25.5, w: 7, h: 5 }, { y: 31, w: 6.5, h: 4.5 }, { y: 36, w: 5, h: 4 },
                    ].map(({ y, w, h }, i) => (
                        <g key={i}>
                            <ellipse cx={28 - w * 0.72} cy={y} rx={w * 0.44} ry={h * 0.52} fill="#A78BFA" opacity={0.72 + i * 0.03} transform={`rotate(-22 ${28 - w * 0.72} ${y})`} />
                            <ellipse cx={28 + w * 0.72} cy={y + 1} rx={w * 0.44} ry={h * 0.52} fill="#7C3AED" opacity={0.68 + i * 0.03} transform={`rotate(22 ${28 + w * 0.72} ${y + 1})`} />
                        </g>
                    ))}
                    <ellipse cx="28" cy="7" rx="3.2" ry="5.5" fill="#8B5CF6" opacity="0.9" />
                    {[13, 19, 25.5, 31, 36].map((y, i) => (
                        <line key={i} x1="28" y1={y - 1} x2="28" y2={y + 2} stroke="#6D28D9" strokeWidth="1" opacity="0.22" />
                    ))}
                </svg>
            );
        default:
            return (
                <svg width={s} height={s} viewBox="0 0 56 56" fill="none">
                    {[0, 60, 120, 180, 240, 300].map((a, i) => (
                        <ellipse key={i} cx="28" cy="13" rx="5" ry="12" fill="#FDA4AF" opacity="0.8" transform={`rotate(${a} 28 28)`} />
                    ))}
                    <circle cx="28" cy="28" r="6.5" fill="#F43F5E" />
                </svg>
            );
    }
}

// ─── Stylized Illustrated Preview ─────────────────────────────────────────────

function BouquetPreview({ bouquet }: { bouquet: BouquetState }) {
    const wrapping = WRAPPINGS.find((w) => w.id === bouquet.wrapping);

    const flowerItems: { flower: typeof FLOWERS[0]; slot: number }[] = [];
    bouquet.flowers.forEach((sel) => {
        const flower = FLOWERS.find((f) => f.id === sel.id);
        if (flower) {
            for (let i = 0; i < Math.min(sel.count, 5); i++) {
                flowerItems.push({ flower, slot: flowerItems.length });
            }
        }
    });

    const total = flowerItems.length;

    const getPos = (slot: number, total: number) => {
        if (total === 0) return { x: 0, y: 0, rotate: 0, scale: 1, zIndex: 1 };
        if (total === 1) return { x: 0, y: 0, rotate: -5, scale: 1, zIndex: 10 };
        const goldenAngle = 137.508;
        const radiusStep = total <= 4 ? 26 : total <= 8 ? 22 : total <= 12 ? 18 : 14;
        const angle = slot * goldenAngle * (Math.PI / 180);
        const radius = Math.sqrt(slot) * radiusStep * 0.72;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * 0.55;
        const rotate = (slot * 31) % 70 - 35;
        const scale = Math.max(1 - slot * 0.01, 0.82);
        return { x, y, rotate, scale, zIndex: total - slot };
    };

    const flowerSize = total <= 3 ? 64 : total <= 6 ? 54 : total <= 10 ? 46 : 38;

    return (
        <div className="flex flex-col items-center select-none">
            <div className="relative w-56 h-[330px] flex items-end justify-center">

                {/* Empty placeholder */}
                {total === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <div className="w-24 h-24 rounded-full border-2 border-dashed border-rose-200 bg-rose-50/60 flex items-center justify-center opacity-40">
                            <FlowerSVG id="rose" size={44} />
                        </div>
                        <p className="text-[11px] text-[#C4A0A0] tracking-wide text-center font-light leading-relaxed">
                            Your bouquet<br />appears here
                        </p>
                    </div>
                )}

                {/* Long stem bundle — z-20, sits behind flowers */}
                {total > 0 && (
                    <div className="absolute bottom-[62px] left-1/2 -translate-x-1/2 z-20">
                        <svg width="48" height="140" viewBox="0 0 48 140" fill="none">
                            <path d="M16 0 Q14 45 13 88 Q15 110 19 140" stroke="#4ADE80" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                            <path d="M24 0 Q24 48 24 95 Q24 118 24 140" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" fill="none" />
                            <path d="M32 0 Q34 45 35 88 Q33 110 29 140" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                            {/* leaf left */}
                            <path d="M14 46 Q3 34 7 22 Q12 34 14 46Z" fill="#4ADE80" opacity="0.85" />
                            <line x1="14" y1="46" x2="7" y2="25" stroke="#15803D" strokeWidth="0.6" opacity="0.45" />
                            {/* leaf right */}
                            <path d="M34 72 Q45 60 41 48 Q37 60 34 72Z" fill="#22C55E" opacity="0.85" />
                            <line x1="34" y1="72" x2="41" y2="50" stroke="#15803D" strokeWidth="0.6" opacity="0.45" />
                        </svg>
                    </div>
                )}

                {/* Wrapping cone — z-30, sits above stem but below flowers */}
                {total > 0 && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-30">
                        <svg width="84" height="100" viewBox="0 0 84 100" fill="none" className="drop-shadow-md">
                            <path d="M7 7 L77 7 L61 100 L23 100 Z" fill={wrapping?.color ?? "#F3E6E6"} opacity="0.93" />
                            <path d="M7 7 L77 7 L61 100 L23 100 Z" fill="url(#wrapG)" opacity="0.45" />
                            <path d="M7 7 L25 100" stroke={wrapping?.darkColor ?? "#9A7A7A"} strokeWidth="0.6" strokeOpacity="0.18" />
                            <path d="M77 7 L59 100" stroke={wrapping?.darkColor ?? "#9A7A7A"} strokeWidth="0.6" strokeOpacity="0.18" />
                            <path d="M17 22 Q42 29 67 22" stroke={wrapping?.darkColor ?? "#9A7A7A"} strokeWidth="0.7" strokeOpacity="0.2" fill="none" />
                            <path d="M15 40 Q42 47 69 40" stroke={wrapping?.darkColor ?? "#9A7A7A"} strokeWidth="0.65" strokeOpacity="0.16" fill="none" />
                            <path d="M16 58 Q42 65 68 58" stroke={wrapping?.darkColor ?? "#9A7A7A"} strokeWidth="0.6" strokeOpacity="0.12" fill="none" />
                            <path d="M18 76 Q42 82 66 76" stroke={wrapping?.darkColor ?? "#9A7A7A"} strokeWidth="0.55" strokeOpacity="0.1" fill="none" />
                            <path d="M7 7 L22 7 L32 100 L23 100 Z" fill="white" opacity="0.1" />
                            <defs>
                                <linearGradient id="wrapG" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="white" stopOpacity="0.5" />
                                    <stop offset="100%" stopColor={wrapping?.darkColor ?? "#6B4E4E"} stopOpacity="0.22" />
                                </linearGradient>
                            </defs>
                        </svg>
                        {/* SVG bow */}
                        {wrapping && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                <svg width="40" height="22" viewBox="0 0 40 22" fill="none">
                                    <path d="M20 11 Q6 1 2 7 Q4 16 20 11Z" fill={wrapping.color} stroke={wrapping.darkColor} strokeWidth="0.5" opacity="0.92" />
                                    <path d="M20 11 Q34 1 38 7 Q36 16 20 11Z" fill={wrapping.color} stroke={wrapping.darkColor} strokeWidth="0.5" opacity="0.92" />
                                    <ellipse cx="20" cy="11" rx="4" ry="3.2" fill={wrapping.darkColor} opacity="0.35" />
                                    <ellipse cx="20" cy="11" rx="2.4" ry="2" fill={wrapping.color} />
                                </svg>
                            </div>
                        )}
                    </div>
                )}

                {/* SVG flower cluster — z-40, renders on top of stems naturally */}
                {total > 0 && (
                    <div className="absolute left-1/2 -translate-x-1/2 z-40" style={{ bottom: "204px" }}>
                        {flowerItems.map(({ flower, slot }) => {
                            const pos = getPos(slot, total);
                            return (
                                <div
                                    key={`${flower.id}-${slot}`}
                                    className="absolute transition-all duration-500"
                                    style={{
                                        left: `${pos.x}px`,
                                        top: `${pos.y}px`,
                                        transform: `translate(-50%, -50%) rotate(${pos.rotate}deg) scale(${pos.scale})`,
                                        zIndex: pos.zIndex,
                                        filter: `drop-shadow(0 3px 7px ${flower.shadowColor})`,
                                    }}
                                >
                                    <FlowerSVG id={flower.id} size={flowerSize} />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Caption */}
            <div className="mt-2 text-center space-y-1 min-h-[44px]">
                {total > 0 ? (
                    <>
                        <p className="text-sm font-serif text-[#6B4E4E]">
                            {bouquet.flowers.reduce((s, f) => s + f.count, 0)} stems
                        </p>
                        <p className="text-[11px] text-[#9A7A7A] leading-relaxed max-w-[190px] mx-auto">
                            {bouquet.flowers.map((sel) => FLOWERS.find((f) => f.id === sel.id)?.name).join(" · ")}
                        </p>
                        {wrapping && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 mt-1">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ background: wrapping.color, border: `1px solid ${wrapping.darkColor}30` }} />
                                <span className="text-[10px] text-[#9A7A7A]">{wrapping.name}</span>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-[11px] text-[#C4A0A0] tracking-wide">Select flowers to begin</p>
                )}
            </div>
        </div>
    );
}


// ─── Price Summary ─────────────────────────────────────────────────────────────

function PriceSummary({ bouquet }: { bouquet: BouquetState }) {
    const flowerCost = bouquet.flowers.reduce((sum, sel) => {
        const f = FLOWERS.find((fl) => fl.id === sel.id);
        return sum + (f ? f.price * sel.count : 0);
    }, 0);
    const wrappingCost = WRAPPINGS.find((w) => w.id === bouquet.wrapping)?.price ?? 0;

    return (
        <div className="space-y-2 text-sm">
            {bouquet.flowers.map((sel) => {
                const f = FLOWERS.find((fl) => fl.id === sel.id);
                if (!f) return null;
                return (
                    <div key={sel.id} className="flex justify-between text-[#7A6060]">
                        <span className="flex items-center gap-2">
                            <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                                <FlowerSVG id={f.id} size={16} />
                            </span>
                            {f.name} × {sel.count}
                        </span>
                        <span>Rs. {(f.price * sel.count).toLocaleString()}</span>
                    </div>
                );
            })}
            {bouquet.wrapping && (
                <div className="flex justify-between text-[#7A6060]">
                    <span>Wrapping</span>
                    <span>Rs. {wrappingCost}</span>
                </div>
            )}
            <div className="pt-2 border-t border-rose-200 flex justify-between font-semibold text-[#6B4E4E]">
                <span>Total</span>
                <span>Rs. {(flowerCost + wrappingCost).toLocaleString()}</span>
            </div>
        </div>
    );
}

// ─── Step 1: Flowers ───────────────────────────────────────────────────────────

function StepFlowers({ bouquet, onToggle }: { bouquet: BouquetState; onToggle: (id: string) => void }) {
    const selectedIds = bouquet.flowers.map((f) => f.id);
    return (
        <div>
            <h2 className="text-3xl font-serif text-[#6B4E4E] mb-1" style={{ fontFamily: "Georgia, serif" }}>Choose Your Flowers</h2>
            <p className="text-[#9A7A7A] text-sm mb-8">Select one or more blooms. Mix and match freely.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {FLOWERS.map((flower, i) => {
                    const isSelected = selectedIds.includes(flower.id);
                    return (
                        <button
                            key={flower.id}
                            onClick={() => onToggle(flower.id)}
                            className={`group relative rounded-2xl overflow-hidden border-2 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isSelected ? "border-[#6B4E4E] shadow-lg scale-[1.02]" : "border-rose-100 hover:border-[#E8B4B8]"}`}
                            style={{ animationDelay: `${i * 50}ms` }}
                        >
                            <div className="relative aspect-square w-full overflow-hidden">
                                <Image src={flower.img} alt={flower.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width: 640px) 50vw, 25vw" />
                                <div className={`absolute inset-0 transition-opacity duration-300 ${isSelected ? "opacity-100" : "opacity-0"}`} style={{ background: `${flower.color}35` }} />
                                {isSelected && (
                                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#6B4E4E] flex items-center justify-center shadow">
                                        <span className="text-white text-xs font-bold">✓</span>
                                    </div>
                                )}
                                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm text-white text-[10px] font-medium">
                                    Rs. {flower.price}/stem
                                </div>
                            </div>
                            <div className="p-3 bg-white">
                                <h3 className="font-serif text-sm text-[#6B4E4E] font-medium">{flower.name}</h3>
                                <p className="text-[10px] text-[#9A7A7A] mt-0.5">{flower.tagline}</p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Step 2: Count ─────────────────────────────────────────────────────────────

function StepCount({ bouquet, onChange }: { bouquet: BouquetState; onChange: (id: string, count: number) => void }) {
    if (!bouquet.flowers.length) return <div className="text-center py-16 text-[#9A7A7A]">Please go back and select at least one flower.</div>;
    const totalStems = bouquet.flowers.reduce((s, f) => s + f.count, 0);
    return (
        <div>
            <h2 className="text-3xl font-serif text-[#6B4E4E] mb-1" style={{ fontFamily: "Georgia, serif" }}>How Many Stems?</h2>
            <p className="text-[#9A7A7A] text-sm mb-8">Total: <strong className="text-[#6B4E4E]">{totalStems} stems</strong></p>
            <div className="space-y-4">
                {bouquet.flowers.map((sel) => {
                    const flower = FLOWERS.find((f) => f.id === sel.id)!;
                    return (
                        <div key={sel.id} className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-rose-100 shadow-sm">
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-sm">
                                <Image src={flower.img} alt={flower.name} fill className="object-cover" sizes="64px" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-serif text-[#6B4E4E] font-medium text-sm">{flower.name}</h3>
                                <p className="text-xs text-[#9A7A7A] mt-0.5">Rs. {flower.price}/stem · <span className="text-[#6B4E4E] font-medium">Rs. {flower.price * sel.count} total</span></p>
                                <div className="mt-2 flex gap-0.5 flex-wrap">
                                    {Array.from({ length: Math.min(sel.count, 20) }).map((_, i) => (
                                        <div key={i} className="w-1.5 h-4 rounded-full" style={{ background: flower.color, opacity: 0.7 }} />
                                    ))}
                                    {sel.count > 20 && <span className="text-[9px] text-[#9A7A7A] self-center ml-1">+{sel.count - 20}</span>}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button onClick={() => onChange(flower.id, Math.max(1, sel.count - 1))} className="w-9 h-9 rounded-full border-2 border-rose-100 text-[#6B4E4E] flex items-center justify-center text-lg hover:bg-rose-50 hover:border-[#E8B4B8] transition font-light">−</button>
                                <span className="w-8 text-center font-semibold text-[#6B4E4E] text-lg tabular-nums">{sel.count}</span>
                                <button onClick={() => onChange(flower.id, Math.min(20, sel.count + 1))} className="w-9 h-9 rounded-full border-2 border-rose-100 text-[#6B4E4E] flex items-center justify-center text-lg hover:bg-rose-50 hover:border-[#E8B4B8] transition font-light">+</button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="mt-6 flex justify-center">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#F7EDEB] border border-rose-100">
                    <span className="text-sm text-[#9A7A7A]">Total</span>
                    <span className="text-lg font-serif font-semibold text-[#6B4E4E]">{totalStems} stems</span>
                </div>
            </div>
        </div>
    );
}

// ─── Step 3: Wrapping ──────────────────────────────────────────────────────────

function StepWrapping({ bouquet, onSelect }: { bouquet: BouquetState; onSelect: (id: string) => void }) {
    return (
        <div>
            <h2 className="text-3xl font-serif text-[#6B4E4E] mb-1" style={{ fontFamily: "Georgia, serif" }}>Pick Your Wrapping</h2>
            <p className="text-[#9A7A7A] text-sm mb-8">The finishing touch that makes it feel like a gift.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {WRAPPINGS.map((wrap) => {
                    const isSelected = bouquet.wrapping === wrap.id;
                    return (
                        <button
                            key={wrap.id}
                            onClick={() => onSelect(wrap.id)}
                            className={`group relative rounded-2xl overflow-hidden border-2 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isSelected ? "border-[#6B4E4E] shadow-lg scale-[1.02]" : "border-rose-100 hover:border-[#E8B4B8]"}`}
                        >
                            <div className="relative h-36 w-full overflow-hidden">
                                <Image src={wrap.img} alt={wrap.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width: 640px) 50vw, 33vw" />
                                <div className="absolute inset-0 opacity-20" style={{ background: wrap.color }} />
                                {isSelected && (
                                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#6B4E4E] flex items-center justify-center shadow">
                                        <span className="text-white text-xs font-bold">✓</span>
                                    </div>
                                )}
                                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm text-white text-[10px] font-medium">+ Rs. {wrap.price}</div>
                            </div>
                            <div className="p-3 bg-white">
                                <h3 className="font-serif text-sm text-[#6B4E4E] font-medium">{wrap.name}</h3>
                                <p className="text-[10px] text-[#9A7A7A] mt-0.5">{wrap.tagline}</p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Step 4: Note ──────────────────────────────────────────────────────────────

function StepNote({ bouquet, onChange }: { bouquet: BouquetState; onChange: (field: "note" | "recipientName", val: string) => void }) {
    const maxChars = 200;
    return (
        <div>
            <h2 className="text-3xl font-serif text-[#6B4E4E] mb-1" style={{ fontFamily: "Georgia, serif" }}>Add a Personal Note</h2>
            <p className="text-[#9A7A7A] text-sm mb-8">Both fields are optional — but they make all the difference.</p>
            <div className="space-y-5">
                <div>
                    <label className="block text-xs tracking-widest uppercase text-[#9A7A7A] mb-2">To (Recipient&apos;s name)</label>
                    <input
                        type="text"
                        value={bouquet.recipientName}
                        onChange={(e) => onChange("recipientName", e.target.value)}
                        placeholder="e.g. My Dearest Priya..."
                        className="w-full px-5 py-3.5 rounded-xl border-2 border-rose-100 text-[#6B4E4E] placeholder-[#C4A0A0] text-sm focus:outline-none focus:border-[#E8B4B8] transition bg-white"
                    />
                </div>
                <div>
                    <label className="block text-xs tracking-widest uppercase text-[#9A7A7A] mb-2">Your message</label>
                    <div className="relative">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="absolute left-6 right-6 h-px bg-rose-100 pointer-events-none" style={{ top: `${60 + i * 34}px` }} />
                        ))}
                        <textarea
                            value={bouquet.note}
                            onChange={(e) => onChange("note", e.target.value.slice(0, maxChars))}
                            placeholder="Write something from the heart..."
                            rows={7}
                            className="w-full px-6 pt-5 pb-4 rounded-2xl border-2 border-rose-100 text-[#6B4E4E] placeholder-[#C4A0A0] text-sm focus:outline-none focus:border-[#E8B4B8] transition bg-white resize-none relative z-10"
                            style={{ fontFamily: "Georgia, serif", lineHeight: "2.1rem" }}
                        />
                    </div>
                    <div className="mt-1.5 flex justify-between">
                        <span className="text-[10px] text-[#C4A0A0]">Make it heartfelt ✨</span>
                        <span className={`text-[10px] ${bouquet.note.length > maxChars * 0.9 ? "text-rose-400" : "text-[#C4A0A0]"}`}>{bouquet.note.length}/{maxChars}</span>
                    </div>
                </div>
                <div>
                    <p className="text-xs text-[#9A7A7A] mb-3">Quick starters:</p>
                    <div className="flex flex-wrap gap-2">
                        {["You make every day bloom 🌸", "With all my love ❤️", "Thinking of you", "Happy Birthday! 🎂", "Thank you for everything"].map((t) => (
                            <button key={t} onClick={() => onChange("note", t)} className="px-3 py-1.5 rounded-full bg-[#F3E6E6] text-[#6B4E4E] text-xs hover:bg-[#E8D0D0] transition border border-transparent hover:border-[#E8B4B8]">{t}</button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Step 5: Review ────────────────────────────────────────────────────────────

function StepReview({ bouquet, onSubmit, isSubmitting, isSuccess }: {
    bouquet: BouquetState;
    onSubmit: () => void;
    isSubmitting: boolean;
    isSuccess: boolean;
}) {
    const wrapping = WRAPPINGS.find((w) => w.id === bouquet.wrapping);

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="relative w-28 h-28 rounded-full overflow-hidden mb-6 shadow-xl shadow-rose-100 animate-bounce">
                    <Image src="/images/placeholder.jpg" alt="bouquet" fill className="object-cover" />
                    <div className="absolute inset-0 bg-[#E8B4B8]/30" />
                </div>
                <h2 className="text-3xl font-serif text-[#6B4E4E] mb-3">Added to Cart!</h2>
                <p className="text-[#9A7A7A] max-w-sm mb-8">
                    Your custom bouquet has been added. Redirecting to cart...
                </p>
                <button
                    onClick={() => router.push("/cart")}
                    className="px-8 py-3 rounded-full bg-[#6B4E4E] text-white text-sm hover:bg-[#5a3f3f] transition"
                >
                    View Cart Now
                </button>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-3xl font-serif text-[#6B4E4E] mb-1" style={{ fontFamily: "Georgia, serif" }}>Review Your Bouquet</h2>
            <p className="text-[#9A7A7A] text-sm mb-8">Everything look perfect?</p>
            <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-rose-100 p-5">
                    <h4 className="text-xs tracking-widest uppercase text-[#C08080] mb-4">Flowers</h4>
                    <div className="space-y-3">
                        {bouquet.flowers.map((sel) => {
                            const f = FLOWERS.find((fl) => fl.id === sel.id)!;
                            return (
                                <div key={sel.id} className="flex items-center gap-3">
                                    <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-sm">
                                        <Image src={f.img} alt={f.name} fill className="object-cover" sizes="40px" />
                                    </div>
                                    <span className="flex-1 text-sm text-[#6B4E4E] font-medium">{f.name}</span>
                                    <span className="text-sm text-[#9A7A7A]">{sel.count} stems</span>
                                    <span className="text-sm font-semibold text-[#6B4E4E]">Rs. {f.price * sel.count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                {wrapping && (
                    <div className="bg-white rounded-2xl border border-rose-100 p-5 flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-sm">
                            <Image src={wrapping.img} alt={wrapping.name} fill className="object-cover" sizes="56px" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-xs tracking-widest uppercase text-[#C08080] mb-0.5">Wrapping</h4>
                            <p className="text-sm text-[#6B4E4E] font-medium">{wrapping.name}</p>
                            <p className="text-xs text-[#9A7A7A]">{wrapping.tagline}</p>
                        </div>
                        <span className="text-sm font-semibold text-[#6B4E4E]">Rs. {wrapping.price}</span>
                    </div>
                )}
                {(bouquet.recipientName || bouquet.note) && (
                    <div className="bg-[#FDFAF9] rounded-2xl border border-rose-100 p-5">
                        <h4 className="text-xs tracking-widest uppercase text-[#C08080] mb-3">Personal Note</h4>
                        {bouquet.recipientName && <p className="text-sm text-[#6B4E4E] font-serif italic mb-2">To: {bouquet.recipientName}</p>}
                        {bouquet.note && <p className="text-sm text-[#7A6060] font-serif italic leading-relaxed">&ldquo;{bouquet.note}&rdquo;</p>}
                    </div>
                )}
                <div className="bg-[#F7EDEB] rounded-2xl p-5">
                    <PriceSummary bouquet={bouquet} />
                </div>
                <button
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-full text-white text-sm font-medium tracking-wider transition-all duration-300 flex items-center justify-center gap-3 ${isSubmitting ? "bg-[#9A7A7A] cursor-not-allowed" : "bg-[#6B4E4E] hover:bg-[#5a3f3f] hover:shadow-lg hover:shadow-rose-200/50 active:scale-[0.98]"
                        }`}
                >
                    {isSubmitting ? (
                        <>
                            <span className="inline-block animate-spin">🌸</span> Adding to Cart...
                        </>
                    ) : (
                        "Add Custom Bouquet to Cart →"
                    )}
                </button>
            </div>
        </div>
    );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function BouquetBuilder() {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const [bouquet, setBouquet] = useState<BouquetState>({ flowers: [], wrapping: "", note: "", recipientName: "" });

    useEffect(() => {
        contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, [step]);

    const toggleFlower = (id: string) => {
        setBouquet((prev) => {
            const exists = prev.flowers.find((f) => f.id === id);
            if (exists) return { ...prev, flowers: prev.flowers.filter((f) => f.id !== id) };
            return { ...prev, flowers: [...prev.flowers, { id, count: 3 }] };
        });
    };
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    const handleSubmit = async () => {
        if (!isAuthenticated) {
            router.push("/login?redirect=/build");
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                flowers: bouquet.flowers.map((sel) => {
                    const f = FLOWERS.find((fl) => fl.id === sel.id)!;
                    return {
                        flowerId: sel.id,
                        name: f.name,
                        count: sel.count,
                        pricePerStem: f.price,
                    };
                }),
                wrapping: bouquet.wrapping
                    ? {
                        id: bouquet.wrapping,
                        name: WRAPPINGS.find((w) => w.id === bouquet.wrapping)?.name || "",
                        price: WRAPPINGS.find((w) => w.id === bouquet.wrapping)?.price || 0,
                    }
                    : null,
                note: bouquet.note.trim(),
                recipientName: bouquet.recipientName.trim(),
                totalPrice:
                    bouquet.flowers.reduce((sum, sel) => {
                        const f = FLOWERS.find((fl) => fl.id === sel.id);
                        return sum + (f ? f.price * sel.count : 0);
                    }, 0) +
                    (WRAPPINGS.find((w) => w.id === bouquet.wrapping)?.price || 0),
            };

            const result = await addCustomBouquetToCartAction(payload);

            if (result.success) {
                setIsSuccess(true);
                // show toast
                toast.success("Custom bouquet added to cart!");
                setTimeout(() => {
                    router.push("/cart");
                }, 1800);
            } else {
                alert(result.message || "Failed to add bouquet to cart");
            }
        } catch (err: any) {
            console.error("Add custom bouquet error:", err);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const canProceed = () => {
        if (step === 1) return bouquet.flowers.length > 0;
        if (step === 2) return bouquet.flowers.every((f) => f.count > 0);
        if (step === 3) return bouquet.wrapping !== "";
        return true;
    };

    return (
        <div className="min-h-screen bg-[#FBF6F4]">
            {/* Hero */}
            <div className="relative py-14 px-6 text-center overflow-hidden" style={{ background: "linear-gradient(160deg, #F3E6E6 0%, #EDD5D5 50%, #E8D0D0 100%)" }}>
                <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
                    {[
                        { src: "/images/singlerose.jpg", left: "5%", top: "-10%" },
                        { src: "/images/singlesunflower2.jpg", left: "40%", top: "-15%" },
                        { src: "/images/singlepeony4.jpg", left: "78%", top: "-5%" },
                    ].map((item, i) => (
                        <div key={i} className="absolute rounded-full overflow-hidden opacity-10" style={{ width: "130px", height: "130px", left: item.left, top: item.top, transform: `rotate(${i * 12 - 12}deg)` }}>
                            <Image src={item.src} alt="" fill className="object-cover" sizes="130px" />
                        </div>
                    ))}
                </div>
                <p className="text-xs tracking-[0.25em] uppercase text-[#C08080] mb-3 relative z-10">✦ Make it Yours ✦</p>
                <h1 className="text-4xl md:text-6xl font-serif text-[#6B4E4E] relative z-10" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                    Build Your<br /><span className="italic text-[#C08080]">Perfect Bouquet</span>
                </h1>
                <p className="text-[#9A7A7A] mt-4 max-w-sm mx-auto text-sm relative z-10 leading-relaxed">
                    A bouquet as unique as the person you&apos;re giving it to — crafted fresh, delivered with love.
                </p>
            </div>

            {/* Builder */}
            <div ref={contentRef} className="max-w-6xl mx-auto px-4 py-12">
                <StepBar current={step} />
                <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start">
                    <div className="bg-white rounded-3xl border border-rose-50 shadow-sm p-8 min-h-[520px]">
                        {step === 1 && <StepFlowers bouquet={bouquet} onToggle={toggleFlower} />}
                        {step === 2 && <StepCount bouquet={bouquet} onChange={(id, count) => setBouquet((p) => ({ ...p, flowers: p.flowers.map((f) => f.id === id ? { ...f, count } : f) }))} />}
                        {step === 3 && <StepWrapping bouquet={bouquet} onSelect={(id) => setBouquet((p) => ({ ...p, wrapping: id }))} />}
                        {step === 4 && <StepNote bouquet={bouquet} onChange={(f, v) => setBouquet((p) => ({ ...p, [f]: v }))} />}
                        {step === 5 && <StepReview bouquet={bouquet} onSubmit={handleSubmit} isSubmitting={isSubmitting} isSuccess={isSuccess} />}

                        {step < 5 && !isSuccess && (
                            <div className="flex justify-between mt-10 pt-6 border-t border-rose-50">
                                <button
                                    onClick={() => setStep((s) => Math.max(1, s - 1))}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm border border-rose-100 text-[#9A7A7A] hover:bg-rose-50 hover:text-[#6B4E4E] transition ${step === 1 ? "opacity-0 pointer-events-none" : ""}`}
                                >
                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                                    Back
                                </button>
                                <button
                                    onClick={() => setStep((s) => Math.min(5, s + 1))}
                                    disabled={!canProceed()}
                                    className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${canProceed() ? "bg-[#6B4E4E] text-white hover:bg-[#5a3f3f] hover:shadow-md" : "bg-rose-100 text-[#C4A0A0] cursor-not-allowed"}`}
                                >
                                    {step === 4 ? "Review Bouquet" : "Continue"}
                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Sticky preview */}
                    <div className="lg:sticky lg:top-28 space-y-4">
                        <div className="bg-white rounded-3xl border border-rose-50 shadow-sm p-6 text-center overflow-hidden relative">
                            {/* Subtle illustrated background */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                                backgroundImage: `radial-gradient(circle at 20% 80%, #E8B4B8 0%, transparent 50%), radial-gradient(circle at 80% 20%, #C4B5FD 0%, transparent 50%)`,
                            }} />
                            <p className="text-xs tracking-widest uppercase text-[#C08080] mb-5 relative z-10">Live Preview</p>
                            <div className="relative z-10">
                                <BouquetPreview bouquet={bouquet} />
                            </div>
                        </div>

                        {(bouquet.flowers.length > 0 || bouquet.wrapping) && (
                            <div className="bg-white rounded-3xl border border-rose-50 shadow-sm p-5">
                                <p className="text-xs tracking-widest uppercase text-[#C08080] mb-4">Your Order</p>
                                <PriceSummary bouquet={bouquet} />
                            </div>
                        )}
                        <div className="bg-[#F7EDEB] rounded-2xl p-4 text-xs text-[#9A7A7A] text-center leading-relaxed">
                            🌿 All bouquets are handcrafted fresh on the day of delivery.
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes bounceIn {
          0%   { transform: scale(0.3); opacity: 0; }
          50%  { transform: scale(1.1); }
          70%  { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
        </div>
    );
}