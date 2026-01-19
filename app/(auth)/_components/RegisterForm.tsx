"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerSchema, RegisterData } from "../schema/auth.schema";
import { useState, useTransition } from "react";
import { registerAction } from "@/lib/actions/auth-action";

export default function RegisterForm() {
    const router = useRouter();

    const [pending, startTransition] = useTransition();
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false); // UI only

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
        mode: "onSubmit",
    });

    const submit = async (values: RegisterData) => {
        startTransition(async () => {
            setError("");

            const result = await registerAction(values);

            if (result.success) {
                router.push("/login");
            } else {
                setError(result.message);
            }
        });
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-serif text-[#6B4E4E] mb-2">Welcome!</h1>
                <p className="text-sm text-[#9A7A7A]">Sign up to continue</p>
            </div>

            <form onSubmit={handleSubmit(submit)} className="space-y-5">

                {error && (
                    <p className="text-xs text-red-500 text-center">{error}</p>
                )}

                <div>
                    <label className="block text-sm text-gray-700 mb-2">First Name</label>
                    <input {...register("firstName")} className="w-full px-4 py-3 rounded-lg border border-gray-200" />
                    {errors.firstName && <p className="text-xs text-rose-400">{errors.firstName.message}</p>}
                </div>

                <div>
                    <label className="block text-sm text-gray-700 mb-2">Last Name</label>
                    <input {...register("lastName")} className="w-full px-4 py-3 rounded-lg border border-gray-200" />
                    {errors.lastName && <p className="text-xs text-rose-400">{errors.lastName.message}</p>}
                </div>

                <div>
                    <label className="block text-sm text-gray-700 mb-2">Email</label>
                    <input {...register("email")} className="w-full px-4 py-3 rounded-lg border border-gray-200" />
                    {errors.email && <p className="text-xs text-rose-400">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="block text-sm text-gray-700 mb-2">Password</label>
                    <input {...register("password")} type={showPassword ? "text" : "password"} className="w-full px-4 py-3 rounded-lg border border-gray-200" />
                    {errors.password && <p className="text-xs text-rose-400">{errors.password.message}</p>}
                </div>

                <div>
                    <label className="block text-sm text-gray-700 mb-2">Confirm Password</label>
                    <input {...register("confirmPassword")} type={showConfirmPassword ? "text" : "password"} className="w-full px-4 py-3 rounded-lg border border-gray-200" />
                    {errors.confirmPassword && <p className="text-xs text-rose-400">{errors.confirmPassword.message}</p>}
                </div>

                <div className="flex items-center gap-2">
                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                    <label className="text-sm text-[#9A7A7A]">Remember me</label>
                </div>

                <button
                    type="submit"
                    disabled={pending}
                    className="w-full py-3 rounded-full bg-[#E8B4B8] text-white disabled:opacity-60"
                >
                    {pending ? "Creating account..." : "SIGN UP"}
                </button>

                <p className="text-center text-sm text-[#9A7A7A]">
                    Already have an account? <Link href="/login" className="text-[#E8B4B8]">Login</Link>
                </p>
            </form>
        </div>
    );
}
