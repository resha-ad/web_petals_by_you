"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import { handleForgotPassword } from "@/lib/actions/auth-action";

const forgotSchema = z.object({
    email: z.string().email("Invalid email address"),
});

type ForgotData = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
    const [pending, startTransition] = useTransition();
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotData>({
        resolver: zodResolver(forgotSchema),
    });

    const onSubmit = (data: ForgotData) => {
        startTransition(async () => {
            const res = await handleForgotPassword(data.email);
            if (res.success) {
                setSuccess(true);
                toast.success("If the email exists, a reset link has been sent.");
            } else {
                toast.error(res.message || "Something went wrong");
            }
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">
                <h1 className="text-4xl font-serif text-[#6B4E4E] mb-4 text-center">Forgot Password?</h1>
                <p className="text-center text-[#9A7A7A] mb-8">
                    Enter your email and we'll send you a reset link.
                </p>

                {success ? (
                    <div className="text-center py-6">
                        <p className="text-green-600 font-medium">
                            Check your email for the reset link (also check spam).
                        </p>
                        <p className="text-sm text-gray-500 mt-4">
                            The link expires in 1 hour.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Email</label>
                            <input
                                {...register("email")}
                                type="email"
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 text-[#6B4E4E] rounded-lg border border-gray-200 focus:border-[#E8B4B8] focus:ring-1 focus:ring-[#E8B4B8] outline-none"
                            />
                            {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={pending}
                            className="w-full py-3 rounded-full bg-[#E8B4B8] text-white font-medium hover:bg-[#D9A3A7] disabled:opacity-50 transition"
                        >
                            {pending ? "Sending..." : "Send Reset Link"}
                        </button>

                        <p className="text-center text-sm text-[#9A7A7A] pt-4">
                            <a href="/login" className="text-[#E8B4B8] hover:underline">
                                Back to Login
                            </a>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}