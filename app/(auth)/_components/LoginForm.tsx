"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginSchema, LoginData } from "../schema/auth.schema";
import { useState } from "react";

export default function LoginForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async () => {
        await new Promise((r) => setTimeout(r, 800));
        router.push("/dashboard");
    };

    return (
        <div>
            {/* Welcome heading */}
            <div className="mb-8">
                <h1 className="text-4xl font-serif text-[#6B4E4E] mb-2">
                    Welcome!
                </h1>
                <p className="text-sm text-[#9A7A7A]">
                    Log in to continue
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email field */}
                <div>
                    <label className="block text-sm text-gray-700 mb-2">
                        E-mail
                    </label>
                    <div className="relative">
                        <input
                            {...register("email")}
                            type="email"
                            placeholder="Enter your e-mail address"
                            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 focus:border-[#E8B4B8] focus:ring-1 focus:ring-[#E8B4B8] outline-none transition-colors text-gray-700 placeholder:text-gray-400"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <path d="M22 6l-10 7L2 6" />
                            </svg>
                        </div>
                    </div>
                    {errors.email && (
                        <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>
                    )}
                </div>

                {/* Password field */}
                <div>
                    <label className="block text-sm text-gray-700 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
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
                    {errors.password && (
                        <p className="text-xs text-rose-400 mt-1">{errors.password.message}</p>
                    )}
                </div>

                {/* Forgot password link */}
                <div className="text-right">
                    <Link
                        href="/forgot-password"
                        className="text-sm text-[#9A7A7A] hover:text-[#6B4E4E] transition-colors"
                    >
                        Forgot password?
                    </Link>
                </div>

                {/* Login button */}
                <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-[#E8B4B8] text-white font-medium
                             hover:bg-[#D9A3A7] transition-all duration-300 shadow-md hover:shadow-lg"
                >
                    LOGIN
                </button>

                {/* Social login
                <div className="pt-4">
                    <p className="text-center text-sm text-[#9A7A7A] mb-4">Or Sign In with</p>
                    <div className="flex justify-center gap-4">
                        <button
                            type="button"
                            className="w-12 h-12 rounded-full bg-rose-50 hover:bg-rose-100 flex items-center justify-center transition-colors"
                        >
                            <svg className="w-5 h-5" fill="#E8B4B8" viewBox="0 0 24 24">
                                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            className="w-12 h-12 rounded-full bg-rose-50 hover:bg-rose-100 flex items-center justify-center transition-colors"
                        >
                            <svg className="w-5 h-5" fill="#E8B4B8" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            className="w-12 h-12 rounded-full bg-rose-50 hover:bg-rose-100 flex items-center justify-center transition-colors"
                        >
                            <svg className="w-5 h-5" fill="#E8B4B8" viewBox="0 0 24 24">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                            </svg>
                        </button>
                    </div>
                </div> */}

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