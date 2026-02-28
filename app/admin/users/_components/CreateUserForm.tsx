"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition, useRef } from "react";
import { toast } from "react-toastify";
import { handleCreateUser } from "@/lib/actions/admin/user-action";
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const schema = z
    .object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        username: z.string().min(3, "Username must be at least 3 characters"),
        email: z.string().email("Invalid email address"),
        phone: z
            .string()
            .optional()
            .refine(
                (v) => !v || /^(\+?977)?[0-9]{9,10}$/.test(v.replace(/[\s\-]/g, "")),
                { message: "Invalid phone number (e.g. 98XXXXXXXX)" }
            ),
        // ✅ No .default() here — default goes in useForm's defaultValues
        role: z.enum(["user", "admin"]),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(8, "Please confirm your password"),
        image: z
            .instanceof(File)
            .optional()
            .refine((f) => !f || f.size <= MAX_FILE_SIZE, "Max 5MB")
            .refine((f) => !f || ACCEPTED.includes(f.type), "Only jpg/png/webp"),
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

// ✅ Use z.infer which now gives a clean, consistent output type
type FormData = z.infer<typeof schema>;

const inputCls = (err?: string) =>
    `w-full px-3 py-2 rounded-lg border ${err ? "border-red-300" : "border-[#E8D4D4]"
    } text-[#6B4E4E] text-sm outline-none focus:border-[#C4A0A0] focus:ring-1 focus:ring-[#E8D4D4] bg-white transition-colors placeholder:text-[#C0B0B0]`;

const labelCls =
    "block text-[0.68rem] font-bold text-[#9A7A7A] uppercase tracking-wider mb-1.5";

const errCls = "text-[0.68rem] text-red-500 mt-1";

export default function CreateUserForm() {
    const [pending, startTransition] = useTransition();
    const [preview, setPreview] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            phone: "",
            role: "user",   // ✅ default lives here, not in zod schema
            password: "",
            confirmPassword: "",
        },
    });

    const handleImg = (file?: File) => {
        if (file) {
            const r = new FileReader();
            r.onloadend = () => setPreview(r.result as string);
            r.readAsDataURL(file);
            setValue("image", file, { shouldValidate: true });
        } else {
            setPreview(null);
            setValue("image", undefined);
            if (fileRef.current) fileRef.current.value = "";
        }
    };

    const onSubmit = (data: FormData) => {
        startTransition(async () => {
            const fd = new FormData();
            fd.append("firstName", data.firstName);
            fd.append("lastName", data.lastName);
            fd.append("username", data.username);
            fd.append("email", data.email);
            fd.append("phone", data.phone || "");
            fd.append("role", data.role);
            fd.append("password", data.password);
            fd.append("confirmPassword", data.confirmPassword);
            if (data.image) fd.append("image", data.image);

            const res = await handleCreateUser(fd);
            if (res.success) {
                toast.success("User created successfully");
                reset();
                handleImg();
            } else {
                toast.error(res.message || "Failed to create user");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Avatar row */}
            <div className="flex items-center gap-4 p-4 bg-[#FBF6F4] rounded-xl border border-[#F3E6E6]">
                <div className="w-16 h-16 rounded-full bg-[#F3E6E6] border-2 border-[#E8D4D4] overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {preview ? (
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <svg width="24" height="24" fill="none" stroke="#C4A0A0" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                    )}
                </div>
                <div className="flex-1">
                    <p className="text-sm font-semibold text-[#6B4E4E] mb-1.5">Profile Photo</p>
                    <Controller
                        name="image"
                        control={control}
                        render={({ field: { onChange } }) => (
                            <input
                                ref={fileRef}
                                type="file"
                                accept={ACCEPTED.join(",")}
                                onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    handleImg(f);
                                    onChange(f);
                                }}
                                className="text-xs text-[#9A7A7A] file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#F3E6E6] file:text-[#6B4E4E] hover:file:bg-[#EDD8D8] cursor-pointer"
                            />
                        )}
                    />
                    {errors.image && <p className={errCls}>{errors.image.message}</p>}
                    {preview && (
                        <button
                            type="button"
                            onClick={() => handleImg()}
                            className="text-xs text-red-400 mt-1 bg-transparent border-none cursor-pointer p-0"
                        >
                            Remove photo
                        </button>
                    )}
                </div>
            </div>

            {/* Fields grid */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelCls}>First Name *</label>
                    <input {...register("firstName")} placeholder="Jane" className={inputCls(errors.firstName?.message)} />
                    {errors.firstName && <p className={errCls}>{errors.firstName.message}</p>}
                </div>
                <div>
                    <label className={labelCls}>Last Name *</label>
                    <input {...register("lastName")} placeholder="Doe" className={inputCls(errors.lastName?.message)} />
                    {errors.lastName && <p className={errCls}>{errors.lastName.message}</p>}
                </div>
                <div>
                    <label className={labelCls}>Username *</label>
                    <input {...register("username")} placeholder="janedoe" className={inputCls(errors.username?.message)} />
                    {errors.username && <p className={errCls}>{errors.username.message}</p>}
                </div>
                <div>
                    <label className={labelCls}>Email *</label>
                    <input {...register("email")} type="email" placeholder="jane@example.com" className={inputCls(errors.email?.message)} />
                    {errors.email && <p className={errCls}>{errors.email.message}</p>}
                </div>
                <div>
                    <label className={labelCls}>Phone</label>
                    <input {...register("phone")} placeholder="98XXXXXXXX" className={inputCls(errors.phone?.message)} />
                    {errors.phone && <p className={errCls}>{errors.phone.message}</p>}
                </div>
                <div>
                    <label className={labelCls}>Role</label>
                    <select {...register("role")} className={`${inputCls()} cursor-pointer`}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div>
                    <label className={labelCls}>Password *</label>
                    <input {...register("password")} type="password" placeholder="••••••••" className={inputCls(errors.password?.message)} />
                    {errors.password && <p className={errCls}>{errors.password.message}</p>}
                </div>
                <div>
                    <label className={labelCls}>Confirm Password *</label>
                    <input {...register("confirmPassword")} type="password" placeholder="••••••••" className={inputCls(errors.confirmPassword?.message)} />
                    {errors.confirmPassword && <p className={errCls}>{errors.confirmPassword.message}</p>}
                </div>
            </div>

            <button
                type="submit"
                disabled={pending}
                className="w-full py-2.5 rounded-full bg-[#6B4E4E] text-white text-sm font-semibold hover:bg-[#5A3A3A] disabled:opacity-60 transition-colors mt-2"
            >
                {pending ? "Creating…" : "Create User"}
            </button>
        </form>
    );
}