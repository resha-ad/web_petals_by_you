// app/user/profile/_components/ProfilePageClient.tsx
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import UserProfileForm from "../../_components/UserProfileForm";
import OrdersTab from "./OrdersTab";

type Tab = "profile" | "orders";

export default function ProfilePageClient({ user }: { user: any }) {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<Tab>(
        (searchParams.get("tab") as Tab) === "orders" ? "orders" : "profile"
    );

    const avatarUrl = user?.imageUrl
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${user.imageUrl}`
        : null;

    const displayName = user?.firstName
        ? `${user.firstName} ${user.lastName ?? ""}`.trim()
        : user?.username ?? "User";

    return (
        <div style={{ minHeight: "100vh", background: "#FBF6F4" }}>

            {/* ── Profile hero banner ── */}
            <div style={{
                background: "linear-gradient(135deg, #6B4E4E 0%, #3D2314 100%)",
                padding: "40px 24px 70px",
                position: "relative", overflow: "hidden",
            }}>
                {/* Decorative circles */}
                <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(232,180,184,0.12)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: -20, left: 60, width: 80, height: 80, borderRadius: "50%", background: "rgba(232,180,184,0.08)", pointerEvents: "none" }} />

                <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", alignItems: "center", gap: 18, position: "relative" }}>
                    {/* Avatar */}
                    <div style={{
                        width: 72, height: 72, borderRadius: "50%",
                        border: "3px solid rgba(232,180,184,0.5)",
                        overflow: "hidden", flexShrink: 0,
                        background: "#5A3A3A",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "1.8rem",
                    }}>
                        {avatarUrl
                            ? <img src={avatarUrl} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            : "🌸"
                        }
                    </div>
                    <div>
                        <p style={{ margin: "0 0 2px", fontSize: "0.7rem", color: "rgba(232,180,184,0.7)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                            {user?.role === "admin" ? "✦ Administrator" : "✦ Member"}
                        </p>
                        <h1 style={{ margin: 0, color: "white", fontSize: "1.5rem", fontFamily: "Georgia, serif" }}>
                            {displayName}
                        </h1>
                        <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,0.55)", fontSize: "0.82rem" }}>{user?.email}</p>
                    </div>
                </div>
            </div>

            {/* ── Tab bar (overlaps the banner bottom) ── */}
            <div style={{ maxWidth: 680, margin: "-28px auto 0", padding: "0 24px", position: "relative", zIndex: 10 }}>
                <div style={{
                    background: "white", borderRadius: 16, padding: 6,
                    boxShadow: "0 8px 32px rgba(107,78,78,0.12)",
                    display: "flex", gap: 4,
                    border: "1px solid #F3E6E6",
                }}>
                    {([
                        { key: "profile" as Tab, icon: "👤", label: "My Profile" },
                        { key: "orders" as Tab, icon: "📦", label: "My Orders" },
                    ]).map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            style={{
                                flex: 1, padding: "10px 16px", borderRadius: 12, border: "none",
                                cursor: "pointer", fontFamily: "inherit", fontSize: "0.875rem",
                                fontWeight: 500, transition: "all 0.15s",
                                background: activeTab === tab.key ? "#6B4E4E" : "transparent",
                                color: activeTab === tab.key ? "white" : "#9A7A7A",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                            }}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Tab content ── */}
            <div style={{ maxWidth: 680, margin: "20px auto 40px", padding: "0 24px" }}>
                <div style={{
                    background: "white", borderRadius: 20, padding: "28px",
                    border: "1px solid #F3E6E6",
                    boxShadow: "0 4px 24px rgba(107,78,78,0.06)",
                }}>
                    {activeTab === "profile" && (
                        <>
                            <h2 style={{ fontFamily: "Georgia, serif", color: "#6B4E4E", fontSize: "1.2rem", margin: "0 0 24px" }}>
                                Profile Information
                            </h2>
                            {/* UserProfileForm is completely unchanged */}
                            <UserProfileForm user={user} />
                        </>
                    )}
                    {activeTab === "orders" && (
                        <>
                            <h2 style={{ fontFamily: "Georgia, serif", color: "#6B4E4E", fontSize: "1.2rem", margin: "0 0 20px" }}>
                                My Orders
                            </h2>
                            <OrdersTab />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}