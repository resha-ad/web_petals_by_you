"use client";
import { useEffect, useState } from "react";
import { whoAmI } from "@/lib/api/auth"; // ← client version (with Cookies.get)
import { handleLogout } from "@/lib/actions/auth-action";

export default function Header() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        whoAmI()
            .then((res) => {
                if (res.success) setUser(res.data);
                else console.log("Header whoAmI failed:", res.message);
            })
            .catch((err) => console.log("Header whoAmI error:", err));
    }, []);

    return (
        <header className="bg-white border-b border-rose-100 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
                <h2 className="text-xl font-serif text-[#6B4E4E]">
                    Admin Dashboard
                </h2>

                <div className="flex items-center gap-6">
                    <span className="text-sm text-[#9A7A7A]">
                        {user ? user.username : "Admin"}
                    </span>

                    <button
                        onClick={handleLogout}
                        className="px-5 py-2 rounded-full bg-rose-100 text-[#6B4E4E] hover:bg-rose-200 transition text-sm font-medium"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}