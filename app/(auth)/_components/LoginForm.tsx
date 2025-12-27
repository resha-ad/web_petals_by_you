"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoginData, loginSchema } from "../schema/auth.schema";

export default function LoginForm() {
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    const { register, handleSubmit, formState: { errors } } =
        useForm<LoginData>({
            resolver: zodResolver(loginSchema),
        });

    const onSubmit = (data: LoginData) => {
        startTransition(async () => {
            await new Promise((r) => setTimeout(r, 1000));
            router.push("/(auth)/dashboard");
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input {...register("email")} placeholder="Email" className="w-full border p-2 rounded" />
            {errors.email && <p className="text-black">{errors.email.message}</p>}

            <input type="password" {...register("password")} placeholder="Password" className="w-full border p-2 rounded" />
            {errors.password && <p className="text-black">{errors.password.message}</p>}

            <button className="w-full bg-pink-600 text-white py-2 rounded">
                {pending ? "Signing in..." : "Login"}
            </button>

            <p className="text-center text-sm">
                New here? <Link href="/register" className="text-black">Register</Link>
            </p>
        </form>
    );
}
