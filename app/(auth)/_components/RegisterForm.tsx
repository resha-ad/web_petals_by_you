"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerSchema, RegisterData } from "../schema/auth.schema";
import { useState } from "react";

export default function RegisterForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
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
                    Sign up to continue
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* First Name field */}
                <div>
                    <label className="block text-sm text-gray-700 mb-2">
                        First Name
                    </label>
                    <div className="relative">
                        <input
                            {...register("firstName")}
                            type="text"
                            placeholder="Enter your first name"
                            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 focus:border-[#E8B4B8] focus:ring-1 focus:ring-[#E8B4B8] outline-none transition-colors text-gray-700 placeholder:text-gray-400"
                        />
                    </div>
                    {errors.firstName && (
                        <p className="text-xs text-rose-400 mt-1">{errors.firstName.message}</p>
                    )}
                </div>

                {/* Last Name field */}
                <div>
                    <label className="block text-sm text-gray-700 mb-2">
                        Last Name
                    </label>
                    <div className="relative">
                        <input
                            {...register("lastName")}
                            type="text"
                            placeholder="Enter your last name"
                            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 focus:border-[#E8B4B8] focus:ring-1 focus:ring-[#E8B4B8] outline-none transition-colors text-gray-700 placeholder:text-gray-400"
                        />
                    </div>
                    {errors.lastName && (
                        <p className="text-xs text-rose-400 mt-1">{errors.lastName.message}</p>
                    )}
                </div>

                {/* Email field */}
                <div>
                    <label className="block text-sm text-gray-700 mb-2">
                        E-mail
                    </label>
                    <div className="relative">
                        <input
                            {...register("email")}
                            type="email"
                            placeholder="Enter your e-mail"
                            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 focus:border-[#E8B4B8] focus:ring-1 focus:ring-[#E8B4B8] outline-none transition-colors text-gray-700 placeholder:text-gray-400"
                        />
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
                            placeholder="Create a password"
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

                {/* Repeat Password field */}
                <div>
                    <label className="block text-sm text-gray-700 mb-2">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <input
                            {...register("confirmPassword")}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 focus:border-[#E8B4B8] focus:ring-1 focus:ring-[#E8B4B8] outline-none transition-colors text-gray-700 placeholder:text-gray-400"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-400 transition-colors"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                {showConfirmPassword ? (
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
                    {errors.confirmPassword && (
                        <p className="text-xs text-rose-400 mt-1">{errors.confirmPassword.message}</p>
                    )}
                </div>

                {/* Remember me checkbox */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="remember"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-[#E8B4B8] focus:ring-[#E8B4B8]"
                    />
                    <label htmlFor="remember" className="text-sm text-[#9A7A7A]">
                        Remember me
                    </label>
                </div>

                {/* Sign up button */}
                <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-[#E8B4B8] text-white font-medium
                             hover:bg-[#D9A3A7] transition-all duration-300 shadow-md hover:shadow-lg"
                >
                    SIGN UP
                </button>

                {/* Login link */}
                <p className="text-center text-sm text-[#9A7A7A] pt-4">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[#E8B4B8] hover:text-[#D9A3A7] font-medium transition-colors">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}
