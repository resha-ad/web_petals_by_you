// app/admin/users/_components/Header.tsx
import { serverWhoAmI } from "@/lib/api/auth";
import { handleLogout } from "@/lib/actions/auth-action";

export default async function Header() {
    const result = await serverWhoAmI();
    const user = result.success ? result.data : null;

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
                    <form action={handleLogout}>
                        <button
                            type="submit"
                            className="px-5 py-2 rounded-full bg-rose-100 text-[#6B4E4E] hover:bg-rose-200 transition text-sm font-medium"
                        >
                            Logout
                        </button>
                    </form>
                </div>
            </div>
        </header>
    );
}