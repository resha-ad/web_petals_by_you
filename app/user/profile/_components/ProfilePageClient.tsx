"use client";

// app/user/profile/_components/ProfilePageClient.tsx
// Improved: better visual design, cleaner layout

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import UserProfileForm from "../../_components/UserProfileForm";
import OrdersTab from "./OrdersTab";

type Tab = "profile" | "orders";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export default function ProfilePageClient({ user }: { user: any }) {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<Tab>(
        searchParams.get("tab") === "orders" ? "orders" : "profile"
    );

    const avatarUrl = user?.imageUrl ? `${API_BASE}${user.imageUrl}` : null;
    const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.username || "User";
    const initials = displayName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const joined = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-NP", { month: "long", year: "numeric" })
        : null;

    return (
        <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #FBF6F4 0%, #F3E6E6 100%)" }}>

            {/* ── Hero section ── */}
            <div className="relative overflow-hidden pt-8 pb-32">
                {/* Soft petal background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full opacity-[0.06]"
                            style={{
                                width: `${180 + i * 60}px`,
                                height: `${180 + i * 60}px`,
                                background: "#C08080",
                                left: `${-10 + i * 18}%`,
                                top: `${-20 + (i % 3) * 30}%`,
                            }}
                        />
                    ))}
                </div>

                <div className="relative max-w-2xl mx-auto px-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">

                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            <div
                                className="w-24 h-24 rounded-full flex items-center justify-center text-white font-serif text-2xl overflow-hidden border-4"
                                style={{ borderColor: "rgba(192,128,128,0.3)", background: "linear-gradient(135deg, #C08080, #9A6060)" }}
                            >
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="select-none">{initials}</span>
                                )}
                            </div>
                            {/* Role indicator dot */}
                            <div
                                className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${user?.role === "admin" ? "bg-amber-400" : "bg-green-400"
                                    }`}
                                title={user?.role === "admin" ? "Administrator" : "Member"}
                            >
                                <div className="w-2 h-2 rounded-full bg-white" />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-2"
                                style={{ background: "rgba(192,128,128,0.12)", border: "1px solid rgba(192,128,128,0.25)" }}>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#9A6060]">
                                    {user?.role === "admin" ? "Administrator" : "Member"}
                                </span>
                            </div>
                            <h1 className="text-[2rem] text-[#3D2314] leading-tight font-serif">{displayName}</h1>
                            <p className="text-[#9A7A7A] text-sm mt-1">{user?.email}</p>
                            <div className="flex items-center gap-4 mt-2 justify-center sm:justify-start flex-wrap">
                                {user?.phone && (
                                    <span className="text-xs text-[#B09090] flex items-center gap-1">
                                        <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                        </svg>
                                        {user.phone}
                                    </span>
                                )}
                                {joined && (
                                    <span className="text-xs text-[#B09090] flex items-center gap-1">
                                        <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                        </svg>
                                        Since {joined}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Content card ── */}
            <div className="max-w-2xl mx-auto px-6 -mt-24 relative z-10 pb-20">

                {/* Tab switcher */}
                <div
                    className="rounded-2xl p-1.5 flex gap-1 mb-4"
                    style={{
                        background: "white",
                        boxShadow: "0 8px 40px rgba(107,78,78,0.12)",
                        border: "1px solid #F3E6E6",
                    }}
                >
                    {(
                        [
                            {
                                key: "profile" as Tab, label: "My Profile", icon: (
                                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                    </svg>
                                )
                            },
                            {
                                key: "orders" as Tab, label: "My Orders", icon: (
                                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                    </svg>
                                )
                            },
                        ] as const
                    ).map(({ key, label, icon }) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border-none ${activeTab === key
                                    ? "bg-[#6B4E4E] text-white shadow-sm"
                                    : "text-[#9A7A7A] hover:text-[#6B4E4E] hover:bg-[#FBF6F4]"
                                }`}
                        >
                            {icon}
                            {label}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <div
                    className="rounded-2xl p-7"
                    style={{
                        background: "white",
                        border: "1px solid #F3E6E6",
                        boxShadow: "0 4px 24px rgba(107,78,78,0.06)",
                    }}
                >
                    {activeTab === "profile" && (
                        <>
                            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-rose-50">
                                <div className="w-8 h-8 rounded-xl bg-[#F3E6E6] flex items-center justify-center text-[#6B4E4E]">
                                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="font-serif text-[#6B4E4E] text-lg leading-none">Profile Information</h2>
                                    <p className="text-xs text-[#B09090] mt-0.5">Update your personal details</p>
                                </div>
                            </div>
                            <UserProfileForm user={user} />
                        </>
                    )}
                    {activeTab === "orders" && (
                        <>
                            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-rose-50">
                                <div className="w-8 h-8 rounded-xl bg-[#F3E6E6] flex items-center justify-center text-[#6B4E4E]">
                                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="font-serif text-[#6B4E4E] text-lg leading-none">My Orders</h2>
                                    <p className="text-xs text-[#B09090] mt-0.5">Track and manage your orders</p>
                                </div>
                            </div>
                            <OrdersTab />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}