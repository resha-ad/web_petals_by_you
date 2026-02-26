"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import BouquetBuilder from "@/app/_components/BouquetBuilder";
import { useAuth } from "@/app/_contexts/AuthContext";

function BuildContent() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Only act after auth has finished loading
        if (isLoading) return;

        console.log("[BuildPage] isLoading:", isLoading, "isAuthenticated:", isAuthenticated);

        if (!isAuthenticated) {
            console.log("[BuildPage] Not authenticated → redirecting to login");
            router.replace("/login?redirect=/build");
        }
    }, [isAuthenticated, isLoading, router]);

    // Show loading while auth is checking
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6B4E4E] mx-auto mb-4"></div>
                    <p className="text-[#6B4E4E]">Verifying access...</p>
                </div>
            </div>
        );
    }

    // If not authenticated → don't render anything (redirect already happened)
    if (!isAuthenticated) {
        return null;
    }

    // Authenticated → show builder
    return <BouquetBuilder />;
}

export default function BuildPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <BuildContent />
        </Suspense>
    );
}