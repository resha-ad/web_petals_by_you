"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_LINKS = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/users", label: "Users" },
    // Add more links later (e.g. Products, Orders)
];

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (href: string) =>
        href === "/admin" ? pathname === href : pathname?.startsWith(href);

    return (
        <aside className="fixed md:static top-0 left-0 h-screen w-64 bg-white border-r border-rose-100 z-40 overflow-y-auto">
            <div className="p-6 border-b border-rose-100">
                <Link href="/admin" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E8B4B8] flex items-center justify-center text-white font-serif text-xl">
                        P
                    </div>
                    <span className="font-serif text-xl text-[#6B4E4E]">Admin</span>
                </Link>
            </div>

            <nav className="p-4 space-y-1">
                {ADMIN_LINKS.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(link.href)
                                ? "bg-[#E8B4B8]/20 text-[#6B4E4E]"
                                : "text-[#9A7A7A] hover:bg-[#F9F5F5] hover:text-[#6B4E4E]"
                            }`}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}