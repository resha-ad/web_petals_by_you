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

    const { register, handleSubmit, formState: { errors } } =
        useForm<RegisterData>({
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
            <input {...register("name")} placeholder="Full Name" className="w-full border p-2 rounded" />
            {errors.name && <p className="text-black">{errors.name.message}</p>}

            <input {...register("email")} placeholder="Email" className="w-full border p-2 rounded" />
            {errors.email && <p className="text-black">{errors.email.message}</p>}

            <input type="password" {...register("password")} placeholder="Password" className="w-full border p-2 rounded" />
            <input type="password" {...register("confirmPassword")} placeholder="Confirm Password" className="w-full border p-2 rounded" />
            {errors.confirmPassword && <p className="text-black">{errors.confirmPassword.message}</p>}

            <button className="w-full bg-pink-600 text-white py-2 rounded">
                {pending ? "Creating..." : "Create Account"}
            </button>

            <p className="text-center text-sm">
                Already registered? <Link href="/login" className="text-black">Login</Link>
            </p>
        </form>
    );
}
