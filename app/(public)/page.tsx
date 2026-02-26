"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

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

const services = [
    {
        icon: "💐",
        title: "Custom Bouquets",
        desc: "Tell us your story and we'll craft a bouquet that speaks your heart.",
    },
    {
        icon: "🎊",
        title: "Wedding Flowers",
        desc: "Transforming your ceremony into a petal-strewn fairy tale.",
    },
    {
        icon: "🌿",
        title: "Event Styling",
        desc: "From intimate dinners to grand galas — floral magic for every scale.",
    },
    {
        icon: "📦",
        title: "Subscriptions",
        desc: "Fresh blooms delivered to your door, weekly or monthly.",
    },
];

const featured = [
    {
        name: "Blushing Romance",
        price: "NPR 1,200",
        tag: "Bestseller",
        bg: "from-rose-200 to-pink-100",
        emoji: "🌹",
    },
    {
        name: "Spring Whisper",
        price: "NPR 950",
        tag: "New Arrival",
        bg: "from-amber-100 to-rose-100",
        emoji: "🌸",
    },
    {
        name: "Eternal Grace",
        price: "NPR 1,800",
        tag: "Premium",
        bg: "from-fuchsia-100 to-pink-50",
        emoji: "💐",
    },
];

export default function HomePage() {
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [scrollY, setScrollY] = useState(0);
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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

                {/* Large decorative circle */}
                <div
                    className="absolute right-[-10vw] top-1/2 -translate-y-1/2 rounded-full border-2 border-rose-200/40 pointer-events-none"
                    style={{ width: "60vw", height: "60vw" }}
                />
                <div
                    className="absolute right-[-5vw] top-1/2 -translate-y-1/2 rounded-full border border-[#E8B4B8]/30 pointer-events-none"
                    style={{ width: "45vw", height: "45vw" }}
                />

                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                    {/* Eyebrow */}
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-rose-100 mb-8 animate-fade-in">
                        <span className="text-xs text-[#E8B4B8]">✦</span>
                        <span className="text-xs tracking-widest text-[#9A7A7A] uppercase font-medium">
                            Kathmandu's Finest Florals
                        </span>
                        <span className="text-xs text-[#E8B4B8]">✦</span>
                    </div>

                    {/* Main headline */}
                    <h1
                        className="text-6xl md:text-8xl font-serif text-[#6B4E4E] leading-none tracking-tight"
                        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                    >
                        Every Petal
                        <br />
                        <span className="italic text-[#C08080]">Tells a Story</span>
                    </h1>

                    <p className="mt-6 text-lg md:text-xl text-[#9A7A7A] max-w-xl mx-auto leading-relaxed">
                        Handcrafted bouquets that speak when words fall short — for weddings,
                        celebrations, and the quiet moments that matter most.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/shop"
                            className="group px-10 py-4 rounded-full bg-[#6B4E4E] text-white text-sm tracking-wider hover:bg-[#5a3f3f] transition-all duration-300 shadow-lg shadow-rose-200/50 hover:shadow-xl hover:shadow-rose-200/70 hover:-translate-y-0.5"
                        >
                            Shop Now
                            <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                        <Link
                            href="#services"
                            className="px-10 py-4 rounded-full border border-[#D4A0A0] text-[#6B4E4E] text-sm tracking-wider hover:bg-white/60 transition-all duration-300 backdrop-blur-sm"
                        >
                            Explore Services
                        </Link>
                    </div>

                    {/* Trust badges */}
                    <div className="mt-14 flex flex-wrap justify-center gap-8 text-[#9A7A7A]">
                        {[
                            ["500+", "Happy Clients"],
                            ["5★", "Avg. Rating"],
                            ["2hr", "Express Delivery"],
                        ].map(([num, label]) => (
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

            {/* ── FEATURED PRODUCTS ── */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <p className="text-xs tracking-widest uppercase text-[#C08080] mb-3">
                        ✦ Curated for You ✦
                    </p>
                    <h2
                        className="text-4xl md:text-5xl font-serif text-[#6B4E4E]"
                        style={{ fontFamily: "Georgia, serif" }}
                    >
                        Featured Bouquets
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {featured.map((item, i) => (
                        <div
                            key={item.name}
                            className="group relative rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                        >
                            {/* Bouquet visual */}
                            <div className={`h-64 bg-gradient-to-br ${item.bg} flex items-center justify-center relative`}>
                                <div className="text-8xl group-hover:scale-110 transition-transform duration-500">
                                    {item.emoji}
                                </div>
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 rounded-full bg-white/70 backdrop-blur-sm text-xs text-[#6B4E4E] font-medium border border-rose-100">
                                        {item.tag}
                                    </span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-6">
                                <h3 className="font-serif text-xl text-[#6B4E4E]">{item.name}</h3>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="text-[#C08080] font-medium">{item.price}</span>
                                    <button className="px-5 py-2 rounded-full bg-[#F3E6E6] text-[#6B4E4E] text-xs hover:bg-[#E8B4B8] hover:text-white transition-all duration-300">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-10">
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 text-sm text-[#9A7A7A] hover:text-[#6B4E4E] transition border-b border-dashed border-rose-200 pb-0.5"
                    >
                        View all bouquets <span>→</span>
                    </Link>
                </div>
            </section>

            {/* ── STORY BANNER ── */}
            <section className="relative py-20 overflow-hidden" style={{ background: "linear-gradient(135deg, #6B4E4E 0%, #8B6464 100%)" }}>
                {/* Decorative */}
                <div className="absolute inset-0 opacity-10">
                    {[...Array(20)].map((_, i) => (
                        <span
                            key={i}
                            className="absolute text-4xl"
                            style={{ left: `${i * 5}%`, top: `${(i * 23) % 100}%`, transform: `rotate(${i * 18}deg)` }}
                        >
                            🌸
                        </span>
                    ))}
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <p className="text-rose-200 text-xs tracking-widest uppercase mb-4">Our Promise</p>
                    <h2
                        className="text-4xl md:text-6xl font-serif text-white leading-tight"
                        style={{ fontFamily: "Georgia, serif" }}
                    >
                        "Flowers are the music <br />
                        <em className="text-[#E8B4B8]">of the ground."</em>
                    </h2>
                    <p className="mt-6 text-rose-100/80 max-w-lg mx-auto text-base leading-relaxed">
                        From our hands to your heart — we source the freshest blooms from local growers
                        in Nepal and craft every arrangement with intention and love.
                    </p>
                    <div className="mt-8 flex justify-center gap-10">
                        {[
                            ["Same-day", "Delivery in KTM"],
                            ["100% Fresh", "Guaranteed"],
                            ["Custom", "Every Order"],
                        ].map(([bold, text]) => (
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
                    <p className="text-xs tracking-widest uppercase text-[#C08080] mb-3">
                        ✦ What We Offer ✦
                    </p>
                    <h2
                        className="text-4xl md:text-5xl font-serif text-[#6B4E4E]"
                        style={{ fontFamily: "Georgia, serif" }}
                    >
                        Our Services
                    </h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((s, i) => (
                        <div
                            key={s.title}
                            className="group p-8 rounded-3xl bg-white border border-rose-50 hover:border-[#E8B4B8] hover:shadow-lg transition-all duration-400 hover:-translate-y-1 text-center"
                        >
                            <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-300">
                                {s.icon}
                            </div>
                            <h3 className="font-serif text-lg text-[#6B4E4E] mb-3">{s.title}</h3>
                            <p className="text-sm text-[#9A7A7A] leading-relaxed">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="py-20 px-6" style={{ background: "#F7EDEB" }}>
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="text-xs tracking-widest uppercase text-[#C08080] mb-3">
                            ✦ Simple & Seamless ✦
                        </p>
                        <h2
                            className="text-4xl md:text-5xl font-serif text-[#6B4E4E]"
                            style={{ fontFamily: "Georgia, serif" }}
                        >
                            How It Works
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 relative">
                        {/* connector line */}
                        <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent" />

                        {[
                            { step: "01", icon: "🔍", label: "Browse", desc: "Explore our curated collection or describe your dream bouquet." },
                            { step: "02", icon: "🎨", label: "Customize", desc: "Pick flowers, colors, size, and a personal message." },
                            { step: "03", icon: "📦", label: "We Craft", desc: "Our florists handcraft your arrangement with fresh blooms." },
                            { step: "04", icon: "🚀", label: "Delivered", desc: "Delivered to your door in beautiful packaging." },
                        ].map((item) => (
                            <div key={item.step} className="text-center relative">
                                <div className="w-20 h-20 mx-auto rounded-full bg-white border-2 border-rose-100 flex items-center justify-center text-3xl shadow-sm mb-4">
                                    {item.icon}
                                </div>
                                <div className="text-xs text-[#C08080] tracking-widest mb-1">{item.step}</div>
                                <h4 className="font-serif text-[#6B4E4E] text-lg mb-2">{item.label}</h4>
                                <p className="text-xs text-[#9A7A7A] leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section className="py-24 px-6 max-w-4xl mx-auto text-center">
                <p className="text-xs tracking-widest uppercase text-[#C08080] mb-3">✦ Kind Words ✦</p>
                <h2
                    className="text-4xl md:text-5xl font-serif text-[#6B4E4E] mb-14"
                    style={{ fontFamily: "Georgia, serif" }}
                >
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
                            <p className="text-xl md:text-2xl font-serif italic text-[#6B4E4E] max-w-2xl leading-relaxed mb-6">
                                "{t.text}"
                            </p>
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
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeTestimonial ? "bg-[#E8B4B8] w-6" : "bg-rose-200"
                                }`}
                        />
                    ))}
                </div>
            </section>

            {/* ── CTA SECTION ── */}
            <section className="py-20 px-6">
                <div
                    className="max-w-4xl mx-auto rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #F3E6E6 0%, #EDD5D5 100%)" }}
                >
                    <div className="absolute top-0 right-0 text-[12rem] opacity-10 leading-none select-none pointer-events-none">
                        🌸
                    </div>
                    <p className="text-xs tracking-widest uppercase text-[#C08080] mb-4">
                        ✦ Ready to Bloom? ✦
                    </p>
                    <h2
                        className="text-4xl md:text-5xl font-serif text-[#6B4E4E] mb-5 leading-tight"
                        style={{ fontFamily: "Georgia, serif" }}
                    >
                        Send Someone <br /> a Little Joy Today
                    </h2>
                    <p className="text-[#9A7A7A] max-w-md mx-auto mb-8 leading-relaxed">
                        Because the right flowers at the right moment can change someone's entire day.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/shop"
                            className="px-10 py-4 rounded-full bg-[#6B4E4E] text-white text-sm tracking-wider hover:bg-[#5a3f3f] transition-all duration-300 shadow-md"
                        >
                            Order a Bouquet →
                        </Link>
                        <Link
                            href="/register"
                            className="px-10 py-4 rounded-full border border-[#C08080] text-[#6B4E4E] text-sm tracking-wider hover:bg-white/60 transition-all duration-300"
                        >
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