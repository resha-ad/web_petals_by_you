import Link from "next/link";

export default function HomePage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
            <div className="text-center bg-white/70 backdrop-blur-md rounded-2xl shadow-sm px-10 py-12 max-w-lg w-full">

                {/* Title */}
                <h1 className="text-4xl font-semibold text-black">
                    Petals By You
                </h1>

                {/* Tagline */}
                <p className="mt-3 text-black">
                    Perfect flowers for every occassion
                </p>

                {/* Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">

                    <Link
                        href="/login"
                        className="px-6 py-2 rounded-full border border-rose-300 text-black text-sm font-medium
                       hover:bg-pink-100 transition"
                    >
                        Login
                    </Link>

                    <Link
                        href="/register"
                        className="px-6 py-2 rounded-full bg-pink-100 text-black text-sm font-medium
                       hover:bg-pink-200 transition"
                    >
                        Sign Up
                    </Link>

                </div>
            </div>
        </main>
    );
}
