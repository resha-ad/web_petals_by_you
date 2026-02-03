import Link from "next/link";

export default function UserDashboardPage() {
    return (
        <main className="min-h-screen bg-[#FBF6F4] flex flex-col items-center justify-center px-6">
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-lg">
                <h1 className="text-4xl font-serif text-[#6B4E4E] mb-6">
                    Welcome Back 🌸
                </h1>
                <p className="text-lg text-[#9A7A7A] mb-10">
                    Your floral journey with Petals by You continues...
                </p>

                <div className="space-y-6">
                    <Link
                        href="/user/profile"
                        className="block w-full py-4 rounded-full bg-[#E8B4B8] text-white text-lg font-medium hover:bg-[#D9A3A7] transition"
                    >
                        View & Edit Profile
                    </Link>

                    {/* Add more user features here later */}
                    <Link
                        href="/shop"
                        className="block w-full py-4 rounded-full border-2 border-[#E8B4B8] text-[#6B4E4E] text-lg font-medium hover:bg-[#F9F5F5] transition"
                    >
                        Browse Bouquets
                    </Link>
                </div>
            </div>
        </main>
    );
}