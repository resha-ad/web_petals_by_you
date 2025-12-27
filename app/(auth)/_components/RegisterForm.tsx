"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RegisterData, registerSchema } from "../schema/auth.schema";

export default function RegisterForm() {
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = (data: RegisterData) => {
        startTransition(async () => {
            await new Promise((r) => setTimeout(r, 1000));
            router.push("/login");
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* First & Last Name */}
            <div className="flex gap-3">
                <div className="w-1/2">
                    <input
                        {...register("firstName")}
                        placeholder="First Name"
                        className="w-full border border-rose-200 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-rose-300"
                    />
                    {errors.firstName && (
                        <p className="text-xs text-rose-400 mt-1">
                            {errors.firstName.message}
                        </p>
                    )}
                </div>

                <div className="w-1/2">
                    <input
                        {...register("lastName")}
                        placeholder="Last Name"
                        className="w-full border border-rose-200 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-rose-300"
                    />
                    {errors.lastName && (
                        <p className="text-xs text-rose-400 mt-1">
                            {errors.lastName.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Email */}
            <div>
                <input
                    {...register("email")}
                    placeholder="Email address"
                    className="w-full border border-rose-200 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-rose-300"
                />
                {errors.email && (
                    <p className="text-xs text-rose-400 mt-1">
                        {errors.email.message}
                    </p>
                )}
            </div>

            {/* Password */}
            <div>
                <input
                    type="password"
                    {...register("password")}
                    placeholder="Password"
                    className="w-full border border-rose-200 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-rose-300"
                />
            </div>

            {/* Confirm Password */}
            <div>
                <input
                    type="password"
                    {...register("confirmPassword")}
                    placeholder="Confirm Password"
                    className="w-full border border-rose-200 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-rose-300"
                />
                {errors.confirmPassword && (
                    <p className="text-xs text-rose-400 mt-1">
                        {errors.confirmPassword.message}
                    </p>
                )}
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={pending}
                className="w-full rounded-full bg-pink-100 text-rose-400 text-sm font-medium py-2
                   hover:bg-pink-200 transition disabled:opacity-60"
            >
                {pending ? "Creating account..." : "Create Account"}
            </button>

            {/* Login link */}
            <p className="text-center text-sm text-rose-400">
                Already registered?{" "}
                <Link href="/login" className="underline hover:text-rose-500">
                    Login
                </Link>
            </p>
        </form>
    );
}
