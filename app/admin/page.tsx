import Link from "next/link";

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-[#FBF6F4] p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-5xl font-serif text-[#6B4E4E] mb-12 text-center">
                    Admin Dashboard 🌹
                </h1>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Quick Stats Cards */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        <h3 className="text-xl font-medium text-[#6B4E4E] mb-4">Total Users</h3>
                        <p className="text-4xl font-bold text-[#E8B4B8]">Loading...</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        <h3 className="text-xl font-medium text-[#6B4E4E] mb-4">Active Sessions</h3>
                        <p className="text-4xl font-bold text-[#E8B4B8]">Loading...</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        <h3 className="text-xl font-medium text-[#6B4E4E] mb-4">Pending Tasks</h3>
                        <p className="text-4xl font-bold text-[#E8B4B8]">Loading...</p>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <Link
                        href="/admin/users"
                        className="inline-block px-10 py-4 rounded-full bg-[#E8B4B8] text-white text-lg font-medium hover:bg-[#D9A3A7] transition"
                    >
                        Manage Users →
                    </Link>
                </div>
            </div>
        </div>
    );
}