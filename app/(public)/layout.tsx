import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-[#FBF6F4]">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-rose-100">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3">
                            <Image
                                src="/images/logo1.png"
                                alt="Petals By You"
                                width={80}
                                height={80}
                                className="object-contain"
                            />
                            <span className="text-xl font-serif text-[#6B4E4E] tracking-wide">
                                PETALS BY YOU
                            </span>
                        </Link>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center gap-8">
                            <Link href="/#services" className="text-sm text-[#9A7A7A] hover:text-[#6B4E4E] transition">
                                Services
                            </Link>
                            <Link href="/#about" className="text-sm text-[#9A7A7A] hover:text-[#6B4E4E] transition">
                                About
                            </Link>
                            <Link href="/#contact" className="text-sm text-[#9A7A7A] hover:text-[#6B4E4E] transition">
                                Contact
                            </Link>
                        </div>

                        {/* Auth Buttons */}
                        <div className="flex items-center gap-4">
                            <Link
                                href="/login"
                                className="text-sm text-[#9A7A7A] hover:text-[#6B4E4E] transition"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="px-6 py-2 rounded-full bg-[#E8B4B8] text-white text-sm hover:bg-[#D9A3A7] transition"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="pt-20">
                {children}
            </div>

            {/* Footer */}
            <footer className="bg-[#F3E6E6] border-t border-rose-100 mt-20">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid md:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div>
                            <h3 className="font-serif text-[#6B4E4E] mb-4">CONTACT US</h3>
                            <div className="space-y-2 text-sm text-[#9A7A7A]">
                                <p>Putalisadak</p>
                                <p>Kathmandu,Nepal</p>
                                <p>contact@petalsbyyou.com</p>
                                <p>(977) 123-4567</p>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="font-serif text-[#6B4E4E] mb-4">QUICK LINKS</h3>
                            <div className="space-y-2 text-sm text-[#9A7A7A]">
                                <Link href="/#services" className="block hover:text-[#6B4E4E] transition">
                                    Our Services
                                </Link>
                                <Link href="/#about" className="block hover:text-[#6B4E4E] transition">
                                    About Us
                                </Link>
                                <Link href="/shop" className="block hover:text-[#6B4E4E] transition">
                                    Shop
                                </Link>
                                <Link href="/contact" className="block hover:text-[#6B4E4E] transition">
                                    Contact
                                </Link>
                            </div>
                        </div>

                        {/* Services */}
                        <div>
                            <h3 className="font-serif text-[#6B4E4E] mb-4">SERVICES</h3>
                            <div className="space-y-2 text-sm text-[#9A7A7A]">
                                <p>Custom Bouquets</p>
                                <p>Wedding Flowers</p>
                                <p>Event Arrangements</p>
                                <p>Flower Subscriptions</p>
                            </div>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h3 className="font-serif text-[#6B4E4E] mb-4">NEWSLETTER</h3>
                            <p className="text-sm text-[#9A7A7A] mb-4">
                                Subscribe for floral tips and exclusive offers
                            </p>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="flex-1 px-4 py-2 rounded-full border border-rose-200 text-sm focus:outline-none focus:border-[#E8B4B8]"
                                />
                                <button className="px-4 py-2 rounded-full bg-[#E8B4B8] text-white text-sm hover:bg-[#D9A3A7] transition">
                                    →
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="mt-12 pt-8 border-t border-rose-200 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-[#9A7A7A]">
                            © 2025 Petals By You. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <Link href="/privacy" className="text-sm text-[#9A7A7A] hover:text-[#6B4E4E] transition">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="text-sm text-[#9A7A7A] hover:text-[#6B4E4E] transition">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}