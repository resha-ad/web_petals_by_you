"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoginData, loginSchema } from "../schema/auth.schema";
import { handleLogin } from "@/lib/actions/auth-action";
import { useState, useTransition } from "react";

export default function LoginForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
        mode: "onSubmit",
    });

    const [pending, startTransition] = useTransition();

    const onSubmit = (data: LoginData) => {
        setError(null);

        startTransition(async () => {
            try {
                const response = await handleLogin(data);
                if (response.success) {
                    router.push("/dashboard");
                } else {
                    setError(response.message || "Login failed");
                }
            } catch (err: any) {
                setError(err.message || "Something went wrong during login");
            }
        });
    };

    const isLoading = isSubmitting || pending;

    return (
        <div>
            {/* Welcome heading – restored from original */}
            <div className="mb-8">
                <h1 className="text-4xl font-serif text-[#6B4E4E] mb-2">Welcome!</h1>
                <p className="text-sm text-[#9A7A7A]">Log in to continue</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && <p className="text-sm text-rose-400 text-center">{error}</p>}

                {/* Email field – with icon */}
                <div>
                    <label className="block text-sm text-gray-700 mb-2">E-mail</label>
                    <div className="relative">
                        <input
                            {...register("email")}
                            type="email"
                            placeholder="Enter your e-mail address"
                            autoComplete="email"
                            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 focus:border-[#E8B4B8] focus:ring-1 focus:ring-[#E8B4B8] outline-none transition-colors text-gray-700 placeholder:text-gray-400"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <path d="M22 6l-10 7L2 6" />
                            </svg>
                        </div>
                    </div>
                    {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>}
                </div>

                {/* Password field – with toggle */}
                <div>
                    <label className="block text-sm text-gray-700 mb-2">Password</label>
                    <div className="relative">
                        <input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 focus:border-[#E8B4B8] focus:ring-1 focus:ring-[#E8B4B8] outline-none transition-colors text-gray-700 placeholder:text-gray-400"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-400 transition-colors"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                {showPassword ? (
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
                                ) : (
                                    <>
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </>
                                )}
                            </svg>
                        </button>
                    </div>
                    {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password.message}</p>}
                </div>

                {/* Forgot password */}
                <div className="text-right">
                    <Link href="/forgot-password" className="text-sm text-[#9A7A7A] hover:text-[#6B4E4E] transition-colors">
                        Forgot password?
                    </Link>
                </div>

                {/* Submit button – restored style */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 rounded-full bg-[#E8B4B8] text-white font-medium hover:bg-[#D9A3A7] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${isLoading ? "cursor-wait" : ""
                        }`}
                >
                    {isLoading ? "LOGGING IN..." : "LOGIN"}
                </button>

                {/* Sign up link */}
                <p className="text-center text-sm text-[#9A7A7A] pt-4">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-[#E8B4B8] hover:text-[#D9A3A7] font-medium transition-colors">
                        Sign Up
                    </Link>
                </p>
            </form>
        </div>
    );
}