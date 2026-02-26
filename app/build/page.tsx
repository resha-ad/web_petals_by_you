"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BouquetBuilder from "@/app/_components/BouquetBuilder";
import { useAuth } from "@/app/_contexts/AuthContext";

export default function BuildPage() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login?redirect=/build");
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6B4E4E] mx-auto mb-4"></div>
                    <p className="text-[#6B4E4E]">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return null; // will redirect

    return <BouquetBuilder />;
}