"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RegisterData, registerSchema } from "../schema/auth.schema";
import { handleRegister } from "@/lib/actions/auth-action";
import { useState, useTransition } from "react";

export default function RegisterForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
        mode: "onSubmit",
    });

    const onSubmit = (data: RegisterData) => {
        setError(null);
        startTransition(async () => {
            try {
                const response = await handleRegister(data);
                if (response.success) {
                    router.push("/login");
                } else {
                    setError(response.message || "Registration failed");
                }
            } catch (err: any) {
                setError(err.message || "Something went wrong during registration");
            }
        });
    };

    const isLoading = isSubmitting || pending;

    const EyeIcon = ({ open }: { open: boolean }) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
            ) : (
                <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                </>
            )}
        </svg>
    );

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-serif text-[#6B4E4E] mb-2">Welcome!</h1>
                <p className="text-sm text-[#9A7A7A]">Sign up to continue</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                    <p className="text-sm text-rose-400 text-center bg-rose-50 py-2 px-4 rounded-lg">
                        {error}
                    </p>
                )}

                {/* First & Last Name */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-700 mb-2">First Name</label>
                        <input
                            {...register("firstName")}
                            type="text"
                            placeholder="Jane"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#E8B4B8] focus:ring-1 focus:ring-[#E8B4B8] outline-none transition-colors text-gray-700 placeholder:text-gray-400"
                        />
                        {errors.firstName && (
                            <p className="text-xs text-rose-400 mt-1">{errors.firstName.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 mb-2">Last Name</label>
                        <input
                            {...register("lastName")}
                            type="text"
                            placeholder="Doe"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#E8B4B8] focus:ring-1 focus:ring-[#E8B4B8] outline-none transition-colors text-gray-700 placeholder:text-gray-400"
                        />
                        {errors.lastName && (
                            <p className="text-xs text-rose-400 mt-1">{errors.lastName.message}</p>
                        )}
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm text-gray-700 mb-2">Email</label>
                    <input
                        {...register("email")}
                        type="email"
                        placeholder="jane@example.com"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#E8B4B8] focus:ring-1 focus:ring-[#E8B4B8] outline-none transition-colors text-gray-700 placeholder:text-gray-400"
                    />
                    {errors.email && (
                        <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>
                    )}
                </div>

                {/* Username */}
                <div>
                    <label className="block text-sm text-gray-700 mb-2">Username</label>
                    <input
                        {...register("username")}
                        type="text"
                        placeholder="janedoe"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#E8B4B8] focus:ring-1 focus:ring-[#E8B4B8] outline-none transition-colors text-gray-700 placeholder:text-gray-400"
                    />
                    {errors.username && (
                        <p className="text-xs text-rose-400 mt-1">{errors.username.message}</p>
                    )}
                </div>

                {/* Phone (optional) */}
                <div>
                    <label className="block text-sm text-gray-700 mb-2">
                        Phone{" "}
                        <span className="text-xs text-gray-400">(optional)</span>
                    </label>
                    <input
                        {...register("phone")}
                        type="tel"
                        placeholder="98XXXXXXXX"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#E8B4B8] focus:ring-1 focus:ring-[#E8B4B8] outline-none transition-colors text-gray-700 placeholder:text-gray-400"
                    />
                    {errors.phone && (
                        <p className="text-xs text-rose-400 mt-1">{errors.phone.message}</p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm text-gray-700 mb-2">Password</label>
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
                            <EyeIcon open={showPassword} />
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-xs text-rose-400 mt-1">{errors.password.message}</p>
                    )}
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-sm text-gray-700 mb-2">Confirm Password</label>
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
                            <EyeIcon open={showConfirmPassword} />
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-xs text-rose-400 mt-1">{errors.confirmPassword.message}</p>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-full bg-[#E8B4B8] text-white font-medium hover:bg-[#D9A3A7] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                    {isLoading ? "Signing up…" : "Sign Up"}
                </button>

                <p className="text-center text-sm text-[#9A7A7A] pt-2">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="text-[#E8B4B8] hover:text-[#D9A3A7] font-medium transition-colors"
                    >
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}