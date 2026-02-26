import { ReactNode } from "react";
import Navbar from "@/app/_components/Navbar";
import Footer from "@/app/_components/Footer";

export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-[#FBF6F4]">
            <Navbar />

            {/* Main Content — pt-20 offsets the fixed navbar height */}
            <div className="pt-20">
                {children}
            </div>

            <Footer />
        </div>
    );
}