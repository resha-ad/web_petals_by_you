import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <section className="min-h-screen bg-pink-50">
            <div className="grid md:grid-cols-2 min-h-screen">
                <div className="hidden md:flex items-center justify-center bg-pink-100">
                    <h2 className="text-3xl font-semibold text-pink-700">
                        Bloom with Petals By You 🌷
                    </h2>
                </div>

                <div className="flex items-center justify-center px-4">
                    <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
}
