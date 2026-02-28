// app/admin/items/[id]/view/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import { getItemById } from "@/lib/api/items";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// ── shared label/value helpers ────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-[0.65rem] font-bold text-[#9A7A7A] uppercase tracking-wider mb-1">
            {children}
        </p>
    );
}

function FieldValue({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-sm font-medium text-[#6B4E4E]">{children}</p>
    );
}

function SectionTitle({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
    return (
        <h2 className="text-xs font-bold text-[#9A7A7A] uppercase tracking-widest mb-4 flex items-center gap-2">
            {icon && <span className="text-[#C4A0A0]">{icon}</span>}
            <span className="w-3 h-px bg-[#E8D4D4] inline-block" />
            {children}
            <span className="flex-1 h-px bg-[#F3E6E6] inline-block" />
        </h2>
    );
}

function Badge({ children, variant = "neutral" }: { children: React.ReactNode; variant?: "green" | "red" | "rose" | "neutral" }) {
    const styles = {
        green: "bg-green-50 text-green-700 border-green-200",
        red: "bg-red-50 text-red-600 border-red-200",
        rose: "bg-[#F3E6E6] text-[#6B4E4E] border-[#EDD8D8]",
        neutral: "bg-[#F9F5F5] text-[#9A7A7A] border-[#EDD8D8]",
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.68rem] font-semibold border ${styles[variant]}`}>
            {children}
        </span>
    );
}

export default async function ViewItemPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    let itemResult;
    try {
        itemResult = await getItemById(id);
    } catch {
        notFound();
    }

    if (!itemResult.success || !itemResult.data) notFound();

    const item = itemResult.data;
    const effectivePrice = item.discountPrice ?? item.price;

    return (
        <div className="max-w-5xl mx-auto">

            {/* ── Back nav ── */}
            <Link
                href="/admin/items"
                className="inline-flex items-center gap-1.5 text-xs text-[#9A7A7A] hover:text-[#6B4E4E] transition-colors no-underline mb-5"
            >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                Back to Products
            </Link>

            {/* ── Page header ── */}
            <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
                <div>
                    <h1 className="font-serif text-[#6B4E4E] text-2xl leading-tight mb-1">{item.name}</h1>
                    <p className="text-[#9A7A7A] text-xs font-mono">{item._id}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href={`/admin/items/${id}/edit`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#6B4E4E] text-white text-xs font-semibold hover:bg-[#5A3A3A] transition-colors no-underline"
                    >
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                        </svg>
                        Edit Product
                    </Link>
                </div>
            </div>

            {/* ── Images strip ── */}
            {item.images?.length > 0 ? (
                <div className="bg-white rounded-2xl border border-[#F3E6E6] p-5 mb-4">
                    <SectionTitle>Images</SectionTitle>
                    <div className="flex gap-3 flex-wrap">
                        {item.images.map((img: string, i: number) => (
                            <div
                                key={i}
                                className={`relative rounded-xl overflow-hidden border border-[#EDD8D8] ${i === 0 ? "w-48 h-48" : "w-24 h-24"}`}
                            >
                                <Image
                                    src={`${API_BASE}${img}`}
                                    alt={`${item.name} image ${i + 1}`}
                                    fill
                                    className="object-cover"
                                />
                                {i === 0 && (
                                    <span className="absolute bottom-1.5 left-1.5 bg-[#6B4E4E]/70 text-white text-[0.55rem] font-semibold px-1.5 py-0.5 rounded-full">
                                        Primary
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-[#F3E6E6] p-8 mb-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-[#F3E6E6] flex items-center justify-center mx-auto mb-2">
                        <svg width="20" height="20" fill="none" stroke="#C4A0A0" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                    </div>
                    <p className="text-sm text-[#9A7A7A]">No images uploaded</p>
                </div>
            )}

            {/* ── Main two-column layout ── */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">

                {/* Left — Pricing & Status */}
                <div className="bg-white rounded-2xl border border-[#F3E6E6] p-5 flex flex-col gap-5">
                    <SectionTitle>Pricing</SectionTitle>

                    {/* Price hero */}
                    <div className="flex items-baseline gap-3">
                        <span className="text-2xl font-bold text-[#6B4E4E]">
                            Rs. {effectivePrice.toLocaleString()}
                        </span>
                        {item.discountPrice && (
                            <span className="text-sm text-[#C0B0B0] line-through">
                                Rs. {item.price.toLocaleString()}
                            </span>
                        )}
                        {item.discountPrice && (
                            <Badge variant="rose">
                                {Math.round(((item.price - item.discountPrice) / item.price) * 100)}% off
                            </Badge>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        <div>
                            <FieldLabel>Category</FieldLabel>
                            {item.category
                                ? <Badge variant="rose">{item.category}</Badge>
                                : <FieldValue>—</FieldValue>
                            }
                        </div>
                        <div>
                            <FieldLabel>Stock</FieldLabel>
                            <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${item.stock === 0 ? "text-red-600" : item.stock <= 5 ? "text-amber-600" : "text-[#6B4E4E]"
                                }`}>
                                <span className={`w-2 h-2 rounded-full ${item.stock === 0 ? "bg-red-400" : item.stock <= 5 ? "bg-amber-400" : "bg-green-400"
                                    }`} />
                                {item.stock} units
                            </span>
                        </div>
                        <div>
                            <FieldLabel>Availability</FieldLabel>
                            <Badge variant={item.isAvailable ? "green" : "neutral"}>
                                <span className={`w-1.5 h-1.5 rounded-full mr-1 ${item.isAvailable ? "bg-green-500" : "bg-gray-400"}`} />
                                {item.isAvailable ? "Available" : "Hidden"}
                            </Badge>
                        </div>
                        <div>
                            <FieldLabel>Featured</FieldLabel>
                            {item.isFeatured ? (
                                <Badge variant="rose">
                                    <svg width="9" height="9" viewBox="0 0 24 24" fill="#E8B4B8" stroke="#C08080" strokeWidth="1" className="mr-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                    </svg>
                                    Featured
                                </Badge>
                            ) : (
                                <Badge variant="neutral">Not Featured</Badge>
                            )}
                        </div>
                        <div>
                            <FieldLabel>Prep Time</FieldLabel>
                            <FieldValue>{item.preparationTime ? `${item.preparationTime} min` : "—"}</FieldValue>
                        </div>
                        <div>
                            <FieldLabel>Delivery Type</FieldLabel>
                            <FieldValue>{item.deliveryType || "—"}</FieldValue>
                        </div>
                        <div className="col-span-2">
                            <FieldLabel>Slug</FieldLabel>
                            <p className="text-xs font-mono text-[#6B4E4E] bg-[#F9F5F5] px-2.5 py-1.5 rounded-lg border border-[#F3E6E6] truncate">
                                {item.slug || "—"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right — Description & Admin Log */}
                <div className="flex flex-col gap-4">
                    {/* Description */}
                    <div className="bg-white rounded-2xl border border-[#F3E6E6] p-5 flex-1">
                        <SectionTitle>Description</SectionTitle>
                        <p className="text-sm text-[#6B4E4E] leading-relaxed whitespace-pre-wrap">
                            {item.description || <span className="text-[#9A7A7A]">No description provided.</span>}
                        </p>
                    </div>

                    {/* Admin Log */}
                    <div className="bg-white rounded-2xl border border-[#F3E6E6] p-5">
                        <SectionTitle>Admin Log</SectionTitle>
                        <div className="grid grid-cols-1 gap-3">
                            <div>
                                <FieldLabel>Created By</FieldLabel>
                                <FieldValue>
                                    {item.createdBy?.username || item.createdBy?.email || "—"}
                                </FieldValue>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <FieldLabel>Created At</FieldLabel>
                                    <FieldValue>
                                        {new Date(item.createdAt).toLocaleDateString("en-NP", { day: "numeric", month: "short", year: "numeric" })}
                                    </FieldValue>
                                </div>
                                <div>
                                    <FieldLabel>Last Updated</FieldLabel>
                                    <FieldValue>
                                        {new Date(item.updatedAt).toLocaleDateString("en-NP", { day: "numeric", month: "short", year: "numeric" })}
                                    </FieldValue>
                                </div>
                            </div>
                            <div>
                                <FieldLabel>Deleted</FieldLabel>
                                <Badge variant={item.isDeleted ? "red" : "green"}>
                                    {item.isDeleted ? "Deleted" : "Active"}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}