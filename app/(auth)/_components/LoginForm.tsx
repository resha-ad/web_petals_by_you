"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginSchema, LoginData } from "../schema/auth.schema";
import { useState, useTransition } from "react";
import { loginAction } from "@/lib/actions/auth-action";

export default function LoginForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [pending, startTransition] = useTransition();
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
        mode: "onSubmit",
    });

    const submit = async (values: LoginData) => {
        startTransition(async () => {
            setError("");

            const result = await loginAction(values);

            if (result.success) {
                router.push("/dashboard");
            } else {
                setError(result.message || "Login failed");
            }
        });
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-serif text-[#6B4E4E] mb-2">
                    Welcome!
                </h1>
                <p className="text-sm text-[#9A7A7A]">
                    Log in to continue
                </p>
            </div>

            <form onSubmit={handleSubmit(submit)} className="space-y-6">

                {error && (
                    <p className="text-xs text-red-500 text-center">{error}</p>
                )}

                {/* Email */}
                <div>
                    <label className="block text-sm text-gray-700 mb-2">
                        E-mail
                    </label>
                    <div className="relative">
                        <input
                            {...register("email")}
                            type="email"
                            placeholder="Enter your e-mail address"
                            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 focus:border-[#E8B4B8] focus:ring-1 focus:ring-[#E8B4B8]"
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

                {/* Password */}
                <div>
                    <label className="block text-sm text-gray-700 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 focus:border-[#E8B4B8] focus:ring-1 focus:ring-[#E8B4B8]"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-400"
                        >
                            👁
                        </button>
                    </div>
                    {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password.message}</p>}
                </div>

                {/* Forgot */}
                <div className="text-right">
                    <Link href="/forgot-password" className="text-sm text-[#9A7A7A] hover:text-[#6B4E4E]">
                        Forgot password?
                    </Link>
                </div>

                {/* Button */}
                <button
                    type="submit"
                    disabled={pending || isSubmitting}
                    className="w-full py-3 rounded-full bg-[#E8B4B8] text-white font-medium hover:bg-[#D9A3A7] disabled:opacity-60"
                >
                    {pending || isSubmitting ? "Logging in..." : "LOGIN"}
                </button>

                {/* Register */}
                <p className="text-center text-sm text-[#9A7A7A] pt-4">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-[#E8B4B8] font-medium">
                        Sign Up
                    </Link>
                </p>
            </form>
        </div>
    );
}
