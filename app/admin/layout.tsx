import Sidebar from "./users/_components/Sidebar";
import Header from "./users/_components/Header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        // min-h-screen on outer div, but items-stretch so sidebar grows with content
        <div className="flex min-h-screen bg-[#FBF6F4] items-stretch">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header />
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}