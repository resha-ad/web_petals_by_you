"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { LoginData, loginSchema } from "../schema/auth.schema";
import { handleLogin } from "@/lib/actions/auth-action";
import { useState, useTransition } from "react";
import { useAuth } from "@/app/_contexts/AuthContext";

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pending, startTransition] = useTransition();

    const { refreshAuth } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
        mode: "onSubmit",
    });

    const onSubmit = (data: LoginData) => {
        setError(null);
        startTransition(async () => {
            try {
                const response = await handleLogin(data);

                if (response.success) {
                    // 1. Cookie is now set server-side by handleLogin.
                    // 2. Re-fetch /whoami so user state is populated in context.
                    await refreshAuth();
                    // 3. Hard-navigate so the full page (including AuthProvider)
                    //    re-mounts with the freshly authenticated state.
                    window.location.href = response.redirectTo ?? "/user/dashboard";
                } else {
                    setError(response.message || "Login failed. Please try again.");
                }
            } catch (err: any) {
                setError(err.message || "Something went wrong during login.");
            }
        });
    };

    const isLoading = isSubmitting || pending;

    return (
        <div>
            {/* Heading */}
            <div className="mb-8">
                <h1 className="text-4xl font-serif text-[#6B4E4E] mb-2">Welcome back</h1>
                <p className="text-sm text-[#9A7A7A]">Sign in to continue</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {error && (
                    <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-100">
                        <p className="text-sm text-rose-500 text-center">{error}</p>
                    </div>
                )}

                {/* Email */}
                <div>
                    <label className="block text-sm text-gray-700 mb-2">Email</label>
                    <input
                        {...register("email")}
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#E8B4B8] focus:ring-1 focus:ring-[#E8B4B8] outline-none transition-colors text-gray-700 placeholder:text-gray-400"
                    />
                    {errors.email && (
                        <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm text-gray-700">Password</label>
                        <Link
                            href="/forgot-password"
                            className="text-xs text-[#C08080] hover:text-[#E8B4B8] transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 focus:border-[#E8B4B8] focus:ring-1 focus:ring-[#E8B4B8] outline-none transition-colors text-gray-700 placeholder:text-gray-400"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-400 transition-colors"
                            aria-label={showPassword ? "Hide password" : "Show password"}
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
                    {errors.password && (
                        <p className="text-xs text-rose-400 mt-1">{errors.password.message}</p>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-full bg-[#E8B4B8] text-white font-medium hover:bg-[#D9A3A7] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Signing in…" : "Sign In"}
                </button>

                <p className="text-center text-sm text-[#9A7A7A] pt-2">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="text-[#E8B4B8] hover:text-[#D9A3A7] font-medium transition-colors"
                    >
                        Sign up
                    </Link>
                </p>
            </form>
        </div>
    );
}