import Sidebar from "./users/_components/Sidebar";
import Header from "./users/_components/Header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-[#FBF6F4]">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}