export default function HomePage() {
    return (
        <main className="min-h-screen bg-[#FBF6F4] flex flex-col items-center justify-center px-6 text-center">
            <h1 className="text-5xl font-serif text-[#6B4E4E] leading-tight">
                Petals by You
            </h1>

            <p className="mt-4 text-lg text-[#9A7A7A] max-w-xl">
                Where every bouquet tells your story
            </p>

            <div className="mt-10 flex gap-6">
                <a
                    href="/login"
                    className="px-8 py-3 rounded-full bg-[#E8B4B8] text-white text-sm tracking-wide hover:bg-[#D9A3A7] transition"
                >
                    Login
                </a>

                <a
                    href="/register"
                    className="px-8 py-3 rounded-full border border-[#E6C1C1] text-[#6B4E4E] text-sm tracking-wide hover:bg-[#F3E6E6] transition"
                >
                    Sign Up
                </a>
            </div>
        </main>
    );
}
