"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import FeaturedItemCard from "@/app/_components/FeaturedItemCard";
import { handleGetAllItems } from "@/lib/actions/item-action";

const flowers = ["🌸", "🌺", "🌹", "💐", "🌷", "🌼"];

const testimonials = [
    {
        name: "Priya S.",
        text: "The most stunning arrangement I've ever received. Every petal was perfect.",
        occasion: "Anniversary",
    },
    {
        name: "Aarav M.",
        text: "They captured exactly what I envisioned for our wedding. Absolute magic.",
        occasion: "Wedding",
    },
    {
        name: "Sita R.",
        text: "Fresh, fragrant, and delivered with care. My go-to for every occasion.",
        occasion: "Birthday",
    },
];

// ─── SVG Icons for Services ────────────────────────────────────────────────────

function IconBouquet() {
    return (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="13" r="5" stroke="#C08080" strokeWidth="1.5" fill="#FDF2F8" />
            <circle cx="11" cy="16" r="4" stroke="#E8B4B8" strokeWidth="1.5" fill="#FDF2F8" />
            <circle cx="25" cy="16" r="4" stroke="#E8B4B8" strokeWidth="1.5" fill="#FDF2F8" />
            <circle cx="14" cy="22" r="3.5" stroke="#D4A0A0" strokeWidth="1.5" fill="#FDF2F8" />
            <circle cx="22" cy="22" r="3.5" stroke="#D4A0A0" strokeWidth="1.5" fill="#FDF2F8" />
            <path d="M18 26 Q17 30 17 34" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M18 26 Q15 28 13 32" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M18 26 Q21 28 23 32" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="18" cy="13" r="2" fill="#E8B4B8" />
            <circle cx="11" cy="16" r="1.5" fill="#F9A8D4" />
            <circle cx="25" cy="16" r="1.5" fill="#F9A8D4" />
        </svg>
    );
}

function IconWedding() {
    return (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Two rings interlinked */}
            <circle cx="13" cy="18" r="7" stroke="#C08080" strokeWidth="1.8" fill="none" />
            <circle cx="23" cy="18" r="7" stroke="#E8B4B8" strokeWidth="1.8" fill="none" />
            {/* Sparkle top */}
            <path d="M18 5 L18.6 7 L20.5 7 L19 8.2 L19.5 10 L18 8.9 L16.5 10 L17 8.2 L15.5 7 L17.4 7 Z" fill="#F9A8D4" />
            {/* Small decorative dots */}
            <circle cx="7" cy="10" r="1" fill="#E8B4B8" opacity="0.6" />
            <circle cx="29" cy="10" r="1" fill="#E8B4B8" opacity="0.6" />
            <circle cx="5" cy="24" r="0.8" fill="#C08080" opacity="0.5" />
            <circle cx="31" cy="24" r="0.8" fill="#C08080" opacity="0.5" />
        </svg>
    );
}

function IconEvent() {
    return (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Table */}
            <rect x="4" y="22" width="28" height="3" rx="1.5" fill="#E8B4B8" />
            <path d="M8 25 L8 32" stroke="#C08080" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M28 25 L28 32" stroke="#C08080" strokeWidth="1.5" strokeLinecap="round" />
            {/* Centerpiece vase */}
            <path d="M15 22 Q14 18 16 16 L18 16 L20 16 Q22 18 21 22 Z" fill="#FDF2F8" stroke="#D4A0A0" strokeWidth="1.2" />
            {/* Flowers in vase */}
            <circle cx="16" cy="11" r="2.5" fill="#F9A8D4" stroke="#C08080" strokeWidth="1" />
            <circle cx="20" cy="11" r="2.5" fill="#FDA4AF" stroke="#C08080" strokeWidth="1" />
            <circle cx="18" cy="9" r="2.5" fill="#E8B4B8" stroke="#C08080" strokeWidth="1" />
            <circle cx="16" cy="11" r="1" fill="#C08080" />
            <circle cx="20" cy="11" r="1" fill="#C08080" />
            <circle cx="18" cy="9" r="1" fill="#C08080" />
            {/* Candles */}
            <rect x="6" y="17" width="2" height="5" rx="1" fill="#FDE68A" stroke="#F59E0B" strokeWidth="0.8" />
            <rect x="28" y="17" width="2" height="5" rx="1" fill="#FDE68A" stroke="#F59E0B" strokeWidth="0.8" />
            <path d="M7 17 Q7.5 15.5 7 14.5" stroke="#F97316" strokeWidth="1" strokeLinecap="round" />
            <path d="M29 17 Q29.5 15.5 29 14.5" stroke="#F97316" strokeWidth="1" strokeLinecap="round" />
        </svg>
    );
}

// ─── SVG Icons for How It Works ────────────────────────────────────────────────

function IconBrowse() {
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="14" cy="14" r="8" stroke="#C08080" strokeWidth="1.8" fill="#FDF2F8" />
            <path d="M20 20 L27 27" stroke="#C08080" strokeWidth="2" strokeLinecap="round" />
            <path d="M11 14 Q11 11 14 11" stroke="#E8B4B8" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="14" cy="14" r="3" fill="#E8B4B8" opacity="0.5" />
        </svg>
    );
}

function IconCustomize() {
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M8 24 L6 26 L8 28 L24 12 L22 10 Z" fill="#FDF2F8" stroke="#C08080" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M22 10 L26 6 L28 8 L24 12" fill="#E8B4B8" stroke="#C08080" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M6 26 L4 28 L6 28 L8 28" stroke="#C08080" strokeWidth="1.2" strokeLinecap="round" />
            {/* Palette dots */}
            <circle cx="24" cy="24" r="4" fill="#FDF2F8" stroke="#E8B4B8" strokeWidth="1.5" />
            <circle cx="22.5" cy="23" r="1" fill="#F9A8D4" />
            <circle cx="25" cy="23" r="1" fill="#FDE68A" />
            <circle cx="24" cy="25.2" r="1" fill="#E8B4B8" />
        </svg>
    );
}

function IconCraft() {
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            {/* Scissors */}
            <circle cx="9" cy="10" r="3" fill="#FDF2F8" stroke="#C08080" strokeWidth="1.5" />
            <circle cx="9" cy="20" r="3" fill="#FDF2F8" stroke="#C08080" strokeWidth="1.5" />
            <path d="M11.5 12 L24 19" stroke="#C08080" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M11.5 18 L24 11" stroke="#C08080" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M24 11 L28 9" stroke="#D4A0A0" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M24 19 L28 21" stroke="#D4A0A0" strokeWidth="1.5" strokeLinecap="round" />
            {/* Snip point */}
            <circle cx="9" cy="10" r="1.2" fill="#E8B4B8" />
            <circle cx="9" cy="20" r="1.2" fill="#E8B4B8" />
        </svg>
    );
}

function IconDelivery() {
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            {/* Box */}
            <rect x="4" y="13" width="18" height="13" rx="1.5" fill="#FDF2F8" stroke="#C08080" strokeWidth="1.5" />
            <path d="M4 17 L22 17" stroke="#E8B4B8" strokeWidth="1.2" />
            <path d="M13 13 L13 17" stroke="#E8B4B8" strokeWidth="1.2" />
            {/* Ribbon */}
            <path d="M13 13 Q11 11 9 12 Q8 14 13 15" fill="#F9A8D4" stroke="#C08080" strokeWidth="0.8" />
            <path d="M13 13 Q15 11 17 12 Q18 14 13 15" fill="#F9A8D4" stroke="#C08080" strokeWidth="0.8" />
            {/* Arrow / motion */}
            <path d="M22 19 L28 16 L28 24 L22 24" fill="#FDF2F8" stroke="#C08080" strokeWidth="1.5" strokeLinejoin="round" />
            <circle cx="8" cy="27" r="2" fill="#E8B4B8" stroke="#C08080" strokeWidth="1.2" />
            <circle cx="18" cy="27" r="2" fill="#E8B4B8" stroke="#C08080" strokeWidth="1.2" />
        </svg>
    );
}

const services = [
    {
        Icon: IconBouquet,
        title: "Custom Bouquets",
        desc: "Tell us your story and we'll craft a bouquet that speaks your heart.",
        href: "/bouquet-builder",
    },
    {
        Icon: IconWedding,
        title: "Wedding Flowers",
        desc: "Transforming your ceremony into a petal-strewn fairy tale.",
        href: "/contact",
    },
    {
        Icon: IconEvent,
        title: "Event Styling",
        desc: "From intimate dinners to grand galas — floral magic for every scale.",
        href: "/contact",
    },
];

const howItWorks = [
    { step: "01", Icon: IconBrowse, label: "Browse", desc: "Explore our curated collection or describe your dream bouquet." },
    { step: "02", Icon: IconCustomize, label: "Customize", desc: "Pick flowers, colors, size, and a personal message." },
    { step: "03", Icon: IconCraft, label: "We Craft", desc: "Our florists handcraft your arrangement with fresh blooms." },
    { step: "04", Icon: IconDelivery, label: "Delivered", desc: "Delivered to your door in beautiful packaging." },
];

// ─── Featured Items Section ────────────────────────────────────────────────────

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

function FeaturedSection() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFeatured() {
            try {
                const res = await handleGetAllItems(1, 20);
                if (res.success && res.data) {
                    const featured = res.data.items.filter((item: Item) => item.isFeatured);
                    setItems(featured.slice(0, 3));
                }
            } catch (err) {
                console.error("Failed to fetch featured items:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchFeatured();
    }, []);

    return (
        <section className="py-24 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-14">
                <p className="text-xs tracking-widest uppercase text-[#C08080] mb-3">✦ Curated for You ✦</p>
                <h2 className="text-4xl md:text-5xl font-serif text-[#6B4E4E]" style={{ fontFamily: "Georgia, serif" }}>
                    Featured Bouquets
                </h2>
                <p className="text-[#9A7A7A] text-sm mt-3 max-w-sm mx-auto leading-relaxed">
                    Each arrangement is handpicked by our florists for its beauty and freshness.
                </p>
            </div>

            {loading ? (
                // Skeleton loaders
                <div className="grid md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="rounded-3xl overflow-hidden bg-white shadow-sm animate-pulse">
                            <div className="h-72 bg-rose-100/60" />
                            <div className="p-5 space-y-3">
                                <div className="h-4 bg-rose-100 rounded w-3/4" />
                                <div className="h-3 bg-rose-50 rounded w-full" />
                                <div className="h-3 bg-rose-50 rounded w-2/3" />
                                <div className="flex justify-between items-center pt-2">
                                    <div className="h-6 bg-rose-100 rounded w-24" />
                                    <div className="w-10 h-10 rounded-full bg-rose-100" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : items.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <FeaturedItemCard key={item._id} item={item} />
                    ))}
                </div>
            ) : (
                // Fallback if no featured items yet
                <div className="text-center py-16 text-[#9A7A7A]">
                    <div className="text-5xl mb-4">💐</div>
                    <p className="text-sm">No featured bouquets yet. Check back soon!</p>
                </div>
            )}

            <div className="text-center mt-10">
                <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-sm text-[#9A7A7A] hover:text-[#6B4E4E] transition border-b border-dashed border-rose-200 pb-0.5"
                >
                    View all bouquets <span>→</span>
                </Link>
            </div>
        </section>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function HomePage() {
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <main className="bg-[#FBF6F4] overflow-x-hidden">

            {/* ── HERO ── */}
            <section
                ref={heroRef}
                className="relative min-h-screen flex items-center justify-center overflow-hidden"
                style={{ background: "linear-gradient(160deg, #FBF6F4 0%, #F3E6E6 50%, #EDD5D5 100%)" }}
            >
                {/* Floating petals */}
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute select-none pointer-events-none"
                        style={{
                            left: `${8 + i * 8}%`,
                            top: `${10 + ((i * 17) % 70)}%`,
                            fontSize: `${1.2 + (i % 3) * 0.6}rem`,
                            opacity: 0.25 + (i % 4) * 0.12,
                            transform: `rotate(${i * 30}deg) translateY(${Math.sin(i) * 10}px)`,
                            animation: `float ${4 + (i % 3)}s ease-in-out infinite`,
                            animationDelay: `${i * 0.4}s`,
                        }}
                    >
                        {flowers[i % flowers.length]}
                    </div>
                ))}

                {/* Large decorative circles */}
                <div className="absolute right-[-10vw] top-1/2 -translate-y-1/2 rounded-full border-2 border-rose-200/40 pointer-events-none" style={{ width: "60vw", height: "60vw" }} />
                <div className="absolute right-[-5vw] top-1/2 -translate-y-1/2 rounded-full border border-[#E8B4B8]/30 pointer-events-none" style={{ width: "45vw", height: "45vw" }} />

                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-rose-100 mb-8 animate-fade-in">
                        <span className="text-xs text-[#E8B4B8]">✦</span>
                        <span className="text-xs tracking-widest text-[#9A7A7A] uppercase font-medium">Kathmandu's Finest Florals</span>
                        <span className="text-xs text-[#E8B4B8]">✦</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-serif text-[#6B4E4E] leading-none tracking-tight" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                        Every Petal
                        <br />
                        <span className="italic text-[#C08080]">Tells a Story</span>
                    </h1>

                    <p className="mt-6 text-lg md:text-xl text-[#9A7A7A] max-w-xl mx-auto leading-relaxed">
                        Handcrafted bouquets that speak when words fall short — for weddings, celebrations, and the quiet moments that matter most.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/shop" className="group px-10 py-4 rounded-full bg-[#6B4E4E] text-white text-sm tracking-wider hover:bg-[#5a3f3f] transition-all duration-300 shadow-lg shadow-rose-200/50 hover:shadow-xl hover:shadow-rose-200/70 hover:-translate-y-0.5">
                            Shop Now
                            <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                        <Link href="#services" className="px-10 py-4 rounded-full border border-[#D4A0A0] text-[#6B4E4E] text-sm tracking-wider hover:bg-white/60 transition-all duration-300 backdrop-blur-sm">
                            Explore Services
                        </Link>
                    </div>

                    {/* Trust badges */}
                    <div className="mt-14 flex flex-wrap justify-center gap-8 text-[#9A7A7A]">
                        {[["500+", "Happy Clients"], ["5★", "Avg. Rating"], ["2hr", "Express Delivery"]].map(([num, label]) => (
                            <div key={label} className="text-center">
                                <div className="text-2xl font-serif text-[#C08080]">{num}</div>
                                <div className="text-xs tracking-wide mt-0.5">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#C4A0A0]">
                    <span className="text-xs tracking-widest uppercase">Scroll</span>
                    <div className="w-px h-8 bg-gradient-to-b from-[#E8B4B8] to-transparent animate-pulse" />
                </div>
            </section>

            {/* ── FEATURED BOUQUETS (from backend) ── */}
            <FeaturedSection />

            {/* ── STORY BANNER ── */}
            <section className="relative py-20 overflow-hidden" style={{ background: "linear-gradient(135deg, #6B4E4E 0%, #8B6464 100%)" }}>
                <div className="absolute inset-0 opacity-10">
                    {[...Array(20)].map((_, i) => (
                        <span key={i} className="absolute text-4xl" style={{ left: `${i * 5}%`, top: `${(i * 23) % 100}%`, transform: `rotate(${i * 18}deg)` }}>🌸</span>
                    ))}
                </div>
                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <p className="text-rose-200 text-xs tracking-widest uppercase mb-4">Our Promise</p>
                    <h2 className="text-4xl md:text-6xl font-serif text-white leading-tight" style={{ fontFamily: "Georgia, serif" }}>
                        "Flowers are the music <br />
                        <em className="text-[#E8B4B8]">of the ground."</em>
                    </h2>
                    <p className="mt-6 text-rose-100/80 max-w-lg mx-auto text-base leading-relaxed">
                        From our hands to your heart — we source the freshest blooms from local growers in Nepal and craft every arrangement with intention and love.
                    </p>
                    <div className="mt-8 flex justify-center gap-10">
                        {[["Same-day", "Delivery in KTM"], ["100% Fresh", "Guaranteed"], ["Custom", "Every Order"]].map(([bold, text]) => (
                            <div key={bold} className="text-center">
                                <div className="text-white font-serif text-lg">{bold}</div>
                                <div className="text-rose-200/70 text-xs">{text}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── SERVICES ── */}
            <section id="services" className="py-24 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <p className="text-xs tracking-widest uppercase text-[#C08080] mb-3">✦ What We Offer ✦</p>
                    <h2 className="text-4xl md:text-5xl font-serif text-[#6B4E4E]" style={{ fontFamily: "Georgia, serif" }}>
                        Our Services
                    </h2>
                </div>

                <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {services.map(({ Icon, title, desc, href }) => (
                        <Link
                            key={title}
                            href={href}
                            className="group p-8 rounded-3xl bg-white border border-rose-50 hover:border-[#E8B4B8] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center block"
                        >
                            {/* Icon container */}
                            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FDF2F8] border border-rose-100 flex items-center justify-center mb-5 group-hover:bg-[#F9E6E6] group-hover:scale-110 transition-all duration-300 shadow-sm">
                                <Icon />
                            </div>
                            <h3 className="font-serif text-lg text-[#6B4E4E] mb-3 group-hover:text-[#C08080] transition-colors duration-300">{title}</h3>
                            <p className="text-sm text-[#9A7A7A] leading-relaxed">{desc}</p>
                            {/* <div className="mt-5 inline-flex items-center gap-1 text-xs text-[#C08080] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Learn more <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                            </div> */}
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="py-20 px-6" style={{ background: "#F7EDEB" }}>
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="text-xs tracking-widest uppercase text-[#C08080] mb-3">✦ Simple & Seamless ✦</p>
                        <h2 className="text-4xl md:text-5xl font-serif text-[#6B4E4E]" style={{ fontFamily: "Georgia, serif" }}>
                            How It Works
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 relative">
                        {/* Connector line */}
                        <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent" />

                        {howItWorks.map(({ step, Icon, label, desc }) => (
                            <div key={step} className="text-center relative group">
                                <div className="w-20 h-20 mx-auto rounded-full bg-white border-2 border-rose-100 flex items-center justify-center shadow-sm mb-4 group-hover:border-[#E8B4B8] group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                                    <Icon />
                                </div>
                                <div className="text-xs text-[#C08080] tracking-widest mb-1">{step}</div>
                                <h4 className="font-serif text-[#6B4E4E] text-lg mb-2">{label}</h4>
                                <p className="text-xs text-[#9A7A7A] leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section className="py-24 px-6 max-w-4xl mx-auto text-center">
                <p className="text-xs tracking-widest uppercase text-[#C08080] mb-3">✦ Kind Words ✦</p>
                <h2 className="text-4xl md:text-5xl font-serif text-[#6B4E4E] mb-14" style={{ fontFamily: "Georgia, serif" }}>
                    Stories from Our Customers
                </h2>

                <div className="relative min-h-[160px] flex items-center justify-center">
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-700"
                            style={{
                                opacity: i === activeTestimonial ? 1 : 0,
                                transform: i === activeTestimonial ? "translateY(0)" : "translateY(16px)",
                                pointerEvents: i === activeTestimonial ? "auto" : "none",
                            }}
                        >
                            <p className="text-xl md:text-2xl font-serif italic text-[#6B4E4E] max-w-2xl leading-relaxed mb-6">"{t.text}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-200 to-pink-100 flex items-center justify-center text-sm font-semibold text-[#6B4E4E]">
                                    {t.name[0]}
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-medium text-[#6B4E4E]">{t.name}</div>
                                    <div className="text-xs text-[#C08080]">{t.occasion}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center gap-2 mt-6">
                    {testimonials.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveTestimonial(i)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeTestimonial ? "bg-[#E8B4B8] w-6" : "bg-rose-200"}`}
                        />
                    ))}
                </div>
            </section>

            {/* ── CTA SECTION ── */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto rounded-3xl p-12 md:p-16 text-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, #F3E6E6 0%, #EDD5D5 100%)" }}>
                    <div className="absolute top-0 right-0 text-[12rem] opacity-10 leading-none select-none pointer-events-none">🌸</div>
                    <p className="text-xs tracking-widest uppercase text-[#C08080] mb-4">✦ Ready to Bloom? ✦</p>
                    <h2 className="text-4xl md:text-5xl font-serif text-[#6B4E4E] mb-5 leading-tight" style={{ fontFamily: "Georgia, serif" }}>
                        Send Someone <br /> a Little Joy Today
                    </h2>
                    <p className="text-[#9A7A7A] max-w-md mx-auto mb-8 leading-relaxed">
                        Because the right flowers at the right moment can change someone's entire day.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/shop" className="px-10 py-4 rounded-full bg-[#6B4E4E] text-white text-sm tracking-wider hover:bg-[#5a3f3f] transition-all duration-300 shadow-md">
                            Order a Bouquet →
                        </Link>
                        <Link href="/register" className="px-10 py-4 rounded-full border border-[#C08080] text-[#6B4E4E] text-sm tracking-wider hover:bg-white/60 transition-all duration-300">
                            Create an Account
                        </Link>
                    </div>
                </div>
            </section>

            <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(var(--rot, 0deg)); }
          50% { transform: translateY(-18px) rotate(var(--rot, 0deg)); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease both;
        }
      `}</style>
        </main>
    );
}