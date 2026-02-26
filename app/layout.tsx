import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ← Import the AuthProvider
import { AuthProvider } from "@/app/_contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Petals By You",
    template: "%s | Petals By You",
  },
  description: "Flower delivery service with love – fresh bouquets crafted daily in Kathmandu",
  keywords: ["flowers", "bouquet", "delivery", "Kathmandu", "custom bouquet", "gifts"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          antialiased 
          bg-[#FBF6F4] 
          text-[#6B4E4E] 
          min-h-screen
        `}
      >
        {/* Wrap everything with AuthProvider */}
        <AuthProvider>
          {children}

          {/* Toast container */}
          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            toastClassName="!bg-[#6B4E4E] !text-white !rounded-xl !shadow-lg !font-sans"
            progressClassName="!bg-[#E8B4B8]"
          />
        </AuthProvider>
      </body>
    </html>
  );
}