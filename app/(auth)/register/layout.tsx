import { ReactNode } from "react";

export default function RegisterLayout({ children }: { children: ReactNode }) {
    return (
        <section className="min-h-screen bg-linear-to-br from-rose-50 via-pink-50 to-rose-100 flex items-center justify-center px-4 py-8">
            {children}
        </section>
    );
}