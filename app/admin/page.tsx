// app/admin/page.tsx
// Server component — fetches real data from your existing backend actions
import Link from "next/link";
import { handleGetAllUsers } from "@/lib/actions/admin/user-action";
import { handleGetAllItems } from "@/lib/actions/item-action";

// ── helpers ──────────────────────────────────────────────────────────────────

function StatCard({
    icon,
    label,
    value,
    sub,
    accent,
    href,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    sub?: string;
    accent: string;
    href?: string;
}) {
    const inner = (
        <div
            className="bg-white rounded-2xl border border-[#F3E6E6] p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
        >
            <div className="flex items-center justify-between">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: accent + "22" }}
                >
                    <span style={{ color: accent }}>{icon}</span>
                </div>
                {href && (
                    <svg width="14" height="14" fill="none" stroke="#C4A0A0" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                )}
            </div>
            <div>
                <p className="text-2xl font-bold text-[#6B4E4E] leading-none mb-1">{value}</p>
                <p className="text-xs font-semibold text-[#9A7A7A] uppercase tracking-wide">{label}</p>
                {sub && <p className="text-[0.7rem] text-[#B0A0A0] mt-1">{sub}</p>}
            </div>
        </div>
    );
    return href ? <Link href={href} className="no-underline">{inner}</Link> : inner;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="text-xs font-bold text-[#9A7A7A] uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-4 h-px bg-[#E8D4D4] inline-block" />
            {children}
            <span className="flex-1 h-px bg-[#F3E6E6] inline-block" />
        </h2>
    );
}

// ── SVG icons ─────────────────────────────────────────────────────────────────

const IconUsers = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
);
const IconBox = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
    </svg>
);
const IconTag = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.595.33a18.095 18.095 0 0 0 5.223-5.223c.542-.815.369-1.896-.33-2.595L9.568 3Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
    </svg>
);
const IconStar = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
    </svg>
);
const IconAdmin = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
);
const IconWarning = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
);
const IconCheckCircle = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);
const IconEyeOff = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
);

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AdminDashboard() {
    // Fetch data in parallel
    const [usersResult, itemsResult] = await Promise.all([
        handleGetAllUsers(1, 1000).catch(() => null),   // get all for count
        handleGetAllItems(1, 1000).catch(() => null),    // get all for inventory counts
    ]);

    // ── Derive user stats ────────────────────────────────────────────────────
    const allUsers: any[] = usersResult?.success ? (usersResult.data ?? []) : [];
    const totalUsers = usersResult?.pagination?.total ?? allUsers.length;
    const adminCount = allUsers.filter((u) => u.role === "admin").length;
    const regularUsers = totalUsers - adminCount;

    // Recent 5 users (latest first)
    const recentUsers = [...allUsers]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    // ── Derive product stats ──────────────────────────────────────────────────
    const allItems: any[] = itemsResult?.success ? (itemsResult.data?.items ?? []) : [];
    const totalItems = itemsResult?.data?.pagination?.total ?? allItems.length;
    const featuredItems = allItems.filter((i) => i.isFeatured).length;
    const hiddenItems = allItems.filter((i) => !i.isAvailable).length;
    const lowStockItems = allItems.filter((i) => i.stock > 0 && i.stock <= 5);
    const outOfStock = allItems.filter((i) => i.stock === 0 && i.isAvailable).length;

    // Category breakdown
    const categoryMap: Record<string, number> = {};
    allItems.forEach((item) => {
        const cat = item.category || "Uncategorized";
        categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });
    const categories = Object.entries(categoryMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);

    const maxCatCount = categories[0]?.[1] ?? 1;

    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

    return (
        <div className="max-w-6xl mx-auto space-y-8">

            {/* ── Welcome banner ────────────────────────────────────────────── */}
            <div className="bg-gradient-to-r from-[#6B4E4E] to-[#3D2314] rounded-2xl px-7 py-6 flex items-center justify-between overflow-hidden relative">
                {/* decorative circles */}
                <div className="absolute right-0 top-0 w-48 h-48 rounded-full bg-white/5 -translate-y-12 translate-x-12" />
                <div className="absolute right-16 bottom-0 w-24 h-24 rounded-full bg-white/5 translate-y-8" />

                <div className="relative">
                    <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">Welcome back</p>
                    <h1 className="text-white font-serif text-2xl leading-snug">Admin Dashboard</h1>
                    <p className="text-white/50 text-xs mt-1">
                        {totalUsers} user{totalUsers !== 1 ? "s" : ""} · {totalItems} product{totalItems !== 1 ? "s" : ""}
                    </p>
                </div>

                <div className="relative flex gap-2">
                    <Link href="/admin/users" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/15 text-white text-xs font-semibold hover:bg-white/25 transition-colors no-underline">
                        <IconUsers />
                        Users
                    </Link>
                    <Link href="/admin/items" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/15 text-white text-xs font-semibold hover:bg-white/25 transition-colors no-underline">
                        <IconBox />
                        Products
                    </Link>
                </div>
            </div>

            {/* ── Stat cards ────────────────────────────────────────────────── */}
            <div>
                <SectionTitle>Overview</SectionTitle>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <StatCard
                        icon={<IconUsers />}
                        label="Total Users"
                        value={totalUsers}
                        sub={`${adminCount} admin · ${regularUsers} members`}
                        accent="#6B4E4E"
                        href="/admin/users"
                    />
                    <StatCard
                        icon={<IconBox />}
                        label="Total Products"
                        value={totalItems}
                        sub={`${hiddenItems > 0 ? `${hiddenItems} hidden` : "All visible"}`}
                        accent="#D97B8A"
                        href="/admin/items"
                    />
                    <StatCard
                        icon={<IconStar />}
                        label="Featured"
                        value={featuredItems}
                        sub="Products on homepage"
                        accent="#E8A87C"
                        href="/admin/items"
                    />
                    <StatCard
                        icon={<IconAdmin />}
                        label="Admins"
                        value={adminCount}
                        sub={`of ${totalUsers} total users`}
                        accent="#7A9CC4"
                        href="/admin/users"
                    />
                </div>
            </div>

            {/* ── Inventory health + Category breakdown ─────────────────────── */}
            <div className="grid md:grid-cols-2 gap-6">

                {/* Inventory health */}
                <div className="bg-white rounded-2xl border border-[#F3E6E6] p-5">
                    <SectionTitle>Inventory Health</SectionTitle>

                    <div className="space-y-3">
                        {/* In stock */}
                        <div className="flex items-center justify-between py-3 border-b border-[#F9F0EE]">
                            <div className="flex items-center gap-2 text-sm text-[#6B4E4E]">
                                <span className="text-green-500"><IconCheckCircle /></span>
                                Available Products
                            </div>
                            <span className="font-bold text-[#6B4E4E] text-sm">
                                {totalItems - outOfStock - hiddenItems}
                            </span>
                        </div>

                        {/* Low stock */}
                        {lowStockItems.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-2 text-sm text-amber-700">
                                        <span className="text-amber-500"><IconWarning /></span>
                                        Low Stock (≤ 5 units)
                                    </div>
                                    <span className="font-bold text-amber-700 text-sm">{lowStockItems.length}</span>
                                </div>
                                <div className="mt-1 ml-6 space-y-1.5">
                                    {lowStockItems.slice(0, 4).map((item: any) => (
                                        <Link
                                            key={item._id}
                                            href={`/admin/items/${item._id}/edit`}
                                            className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors no-underline"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded bg-amber-100 overflow-hidden flex-shrink-0">
                                                    {item.images?.[0] ? (
                                                        <img src={`${API_BASE}${item.images[0]}`} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-amber-200" />
                                                    )}
                                                </div>
                                                <span className="text-xs text-amber-800 truncate max-w-[130px]">{item.name}</span>
                                            </div>
                                            <span className="text-xs font-bold text-amber-700 flex-shrink-0">
                                                {item.stock} left
                                            </span>
                                        </Link>
                                    ))}
                                    {lowStockItems.length > 4 && (
                                        <p className="text-[0.68rem] text-amber-600 ml-1">+{lowStockItems.length - 4} more low-stock items</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Out of stock */}
                        {outOfStock > 0 && (
                            <div className="flex items-center justify-between py-3 border-t border-[#F9F0EE]">
                                <div className="flex items-center gap-2 text-sm text-red-600">
                                    <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                                    Out of Stock
                                </div>
                                <span className="font-bold text-red-600 text-sm">{outOfStock}</span>
                            </div>
                        )}

                        {/* Hidden */}
                        {hiddenItems > 0 && (
                            <div className="flex items-center justify-between py-3 border-t border-[#F9F0EE]">
                                <div className="flex items-center gap-2 text-sm text-[#9A7A7A]">
                                    <span className="text-[#9A7A7A]"><IconEyeOff /></span>
                                    Hidden Products
                                </div>
                                <span className="font-bold text-[#9A7A7A] text-sm">{hiddenItems}</span>
                            </div>
                        )}

                        {lowStockItems.length === 0 && outOfStock === 0 && (
                            <div className="flex items-center gap-2 py-3 text-green-600 text-sm">
                                <IconCheckCircle />
                                All products well-stocked
                            </div>
                        )}
                    </div>
                </div>

                {/* Category breakdown */}
                <div className="bg-white rounded-2xl border border-[#F3E6E6] p-5">
                    <SectionTitle>Products by Category</SectionTitle>
                    {categories.length === 0 ? (
                        <p className="text-sm text-[#9A7A7A] text-center py-8">No products yet</p>
                    ) : (
                        <div className="space-y-3">
                            {categories.map(([cat, count]) => {
                                const pct = Math.round((count / maxCatCount) * 100);
                                return (
                                    <div key={cat}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-medium text-[#6B4E4E] capitalize">{cat}</span>
                                            <span className="text-xs text-[#9A7A7A] font-mono">{count}</span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-[#F3E6E6] overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-[#E8B4B8] to-[#6B4E4E]"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="pt-2 border-t border-[#F9F0EE] flex items-center justify-between">
                                <span className="text-xs text-[#9A7A7A]">Total across {categories.length} categor{categories.length === 1 ? "y" : "ies"}</span>
                                <span className="text-xs font-bold text-[#6B4E4E]">{totalItems}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Recent users ──────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-[#F3E6E6] overflow-hidden">
                <div className="px-5 py-4 border-b border-[#F9F0EE] flex items-center justify-between">
                    <SectionTitle>Recent Users</SectionTitle>
                    <Link href="/admin/users" className="text-xs text-[#6B4E4E] hover:text-[#5A3A3A] font-semibold no-underline">
                        View all →
                    </Link>
                </div>

                {recentUsers.length === 0 ? (
                    <div className="p-10 text-center text-sm text-[#9A7A7A]">No users yet.</div>
                ) : (
                    <div className="divide-y divide-[#F9F0EE]">
                        {recentUsers.map((user) => (
                            <Link
                                key={user._id}
                                href={`/admin/users/${user._id}`}
                                className="flex items-center gap-3 px-5 py-3 hover:bg-[#FBF6F4] transition-colors no-underline group"
                            >
                                {/* Avatar */}
                                <div className="w-9 h-9 rounded-full bg-[#F3E6E6] overflow-hidden flex-shrink-0 flex items-center justify-center border border-[#EDD8D8]">
                                    {user.imageUrl ? (
                                        <img src={`${API_BASE}${user.imageUrl}`} alt={user.username} className="w-full h-full object-cover" />
                                    ) : (
                                        <svg width="16" height="16" fill="none" stroke="#C4A0A0" strokeWidth="1.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                        </svg>
                                    )}
                                </div>
                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[#6B4E4E] truncate group-hover:text-[#5A3A3A]">
                                        {[user.firstName, user.lastName].filter(Boolean).join(" ") || user.username}
                                    </p>
                                    <p className="text-xs text-[#9A7A7A] truncate">{user.email}</p>
                                </div>
                                {/* Role + date */}
                                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.65rem] font-semibold ${user.role === "admin"
                                            ? "bg-[#F3E6E6] text-[#6B4E4E]"
                                            : "bg-gray-100 text-gray-500"
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${user.role === "admin" ? "bg-[#6B4E4E]" : "bg-gray-400"}`} />
                                        {user.role}
                                    </span>
                                    {user.createdAt && (
                                        <span className="text-[0.65rem] text-[#C0B0B0]">
                                            {new Date(user.createdAt).toLocaleDateString("en-NP", { day: "numeric", month: "short" })}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Quick actions ─────────────────────────────────────────────── */}
            <div>
                <SectionTitle>Quick Actions</SectionTitle>
                <div className="grid sm:grid-cols-3 gap-3">
                    {[
                        {
                            href: "/admin/users/create",
                            label: "Add New User",
                            desc: "Create a customer or admin account",
                            icon: (
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                                </svg>
                            ),
                        },
                        {
                            href: "/admin/items/create",
                            label: "Add New Product",
                            desc: "Upload and list a bouquet or item",
                            icon: (
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            ),
                        },
                        {
                            href: "/admin/orders",
                            label: "Manage Orders",
                            desc: "View and update customer orders",
                            icon: (
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                </svg>
                            ),
                        },
                    ].map(({ href, label, desc, icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className="bg-white rounded-2xl border border-[#F3E6E6] p-4 flex items-start gap-3 hover:shadow-md hover:border-[#E8D4D4] transition-all no-underline group"
                        >
                            <div className="w-9 h-9 rounded-xl bg-[#F3E6E6] flex items-center justify-center text-[#6B4E4E] flex-shrink-0 group-hover:bg-[#6B4E4E] group-hover:text-white transition-colors">
                                {icon}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-[#6B4E4E] group-hover:text-[#5A3A3A]">{label}</p>
                                <p className="text-xs text-[#9A7A7A] mt-0.5">{desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}