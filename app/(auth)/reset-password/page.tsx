"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { z } from "zod";
import { handleResetPassword } from "@/lib/actions/auth-action";

const resetSchema = z.object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type ResetData = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [pending, startTransition] = useTransition();
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetData>({
        resolver: zodResolver(resetSchema),
    });

    useEffect(() => {
        if (!token) {
            toast.error("Invalid or missing reset token");
            router.push("/forgot-password");
        }
    }, [token, router]);

    const onSubmit = (data: ResetData) => {
        if (!token) return;

        startTransition(async () => {
            const res = await handleResetPassword(token, data.newPassword);
            if (res.success) {
                setSuccess(true);
                toast.success("Password reset successful! Please login.");
            } else {
                toast.error(res.message || "Reset failed");
            }
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">
                <h1 className="text-4xl font-serif text-[#6B4E4E] mb-4 text-center">Reset Password</h1>
                <p className="text-center text-[#9A7A7A] mb-8">
                    Enter your new password below
                </p>

                {success ? (
                    <div className="text-center py-6">
                        <p className="text-green-600 font-medium">
                            Your password has been reset successfully!
                        </p>
                        <button
                            onClick={() => router.push("/login")}
                            className="mt-6 px-8 py-3 rounded-full bg-[#E8B4B8] text-white hover:bg-[#D9A3A7] transition"
                        >
                            Go to Login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="block text-sm text-gray-700 mb-2">New Password</label>
                            <input
                                {...register("newPassword")}
                                type="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-3 text-[#6B4E4E] rounded-lg border border-gray-200 focus:border-[#E8B4B8] focus:ring-1 focus:ring-[#E8B4B8] outline-none"
                            />
                            {errors.newPassword && <p className="text-xs text-rose-400 mt-1">{errors.newPassword.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Confirm New Password</label>
                            <input
                                {...register("confirmPassword")}
                                type="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-3 text-[#6B4E4E] rounded-lg border border-gray-200 focus:border-[#E8B4B8] focus:ring-1 focus:ring-[#E8B4B8] outline-none"
                            />
                            {errors.confirmPassword && <p className="text-xs text-rose-400 mt-1">{errors.confirmPassword.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={pending || !token}
                            className="w-full py-3 rounded-full bg-[#E8B4B8] text-white font-medium hover:bg-[#D9A3A7] disabled:opacity-50 transition"
                        >
                            {pending ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}