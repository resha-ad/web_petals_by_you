"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition, useRef } from "react";
import { toast } from "react-toastify";
import { handleUpdateProfile } from "@/lib/actions/auth-action";
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const schema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    phone: z
        .string()
        .optional()
        .refine(
            (v) => !v || /^(\+?977)?[0-9]{9,10}$/.test(v.replace(/[\s\-]/g, "")),
            { message: "Invalid phone number (e.g. 98XXXXXXXX)" }
        ),
    image: z
        .instanceof(File)
        .optional()
        .refine((f) => !f || f.size <= MAX_FILE_SIZE, "Max file size is 5MB")
        .refine((f) => !f || ACCEPTED.includes(f.type), "Only jpg/png/webp allowed"),
});

type FormData = z.infer<typeof schema>;

const inputCls =
    "w-full px-4 py-3 rounded-xl border border-[#E8D4D4] text-[#6B4E4E] text-sm outline-none focus:border-[#C4A0A0] focus:ring-2 focus:ring-[#F3E6E6] bg-white transition-colors placeholder:text-[#C0B0B0]";

export default function UserProfileForm({ user }: { user: any }) {
    const [pending, startTransition] = useTransition();
    const [preview, setPreview] = useState<string | null>(
        user?.imageUrl ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${user.imageUrl}` : null
    );
    const fileRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        setError,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            username: user?.username || "",
            phone: user?.phone || "",
        },
    });

    const handleImg = (file?: File) => {
        if (file) {
            const r = new FileReader();
            r.onloadend = () => setPreview(r.result as string);
            r.readAsDataURL(file);
            setValue("image", file, { shouldValidate: true });
        } else {
            setPreview(
                user?.imageUrl
                    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${user.imageUrl}`
                    : null
            );
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
            fd.append("phone", data.phone || "");
            if (data.image) fd.append("image", data.image);

            const res = await handleUpdateProfile(fd);
            if (res.success) {
                toast.success("Profile updated successfully");
                if (fileRef.current) fileRef.current.value = "";
            } else {
                // Show username-specific error if that's the issue
                if (res.message?.toLowerCase().includes("username")) {
                    setError("username", { message: res.message });
                } else {
                    toast.error(res.message || "Update failed");
                }
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Avatar upload */}
            <div className="flex items-center gap-5">
                <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-[#F3E6E6] border-2 border-[#E8D4D4] overflow-hidden flex items-center justify-center">
                        {preview ? (
                            <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <svg width="28" height="28" fill="none" stroke="#C4A0A0" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        )}
                    </div>
                </div>
                <div className="flex-1">
                    <p className="text-sm font-semibold text-[#6B4E4E] mb-1">Profile Photo</p>
                    <p className="text-xs text-[#9A7A7A] mb-2">JPG, PNG or WEBP, max 5MB</p>
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
                    {errors.image && (
                        <p className="text-xs text-red-500 mt-1">{errors.image.message}</p>
                    )}
                    {/* {preview && (
                        <button
                            type="button"
                            onClick={() => handleImg()}
                            className="text-xs text-red-400 mt-1 block bg-transparent border-none cursor-pointer p-0"
                        >
                            Remove photo
                        </button>
                    )} */}
                </div>
            </div>

            {/* Email — truly locked (immutable identifier) */}
            <div>
                <label className="block text-xs font-bold text-[#9A7A7A] uppercase tracking-wider mb-1.5">
                    Email
                    <span className="ml-2 text-[0.6rem] normal-case font-normal text-[#B0A0A0] bg-[#F3E6E6] px-2 py-0.5 rounded-full">
                        Cannot be changed
                    </span>
                </label>
                <input
                    value={user?.email || ""}
                    readOnly
                    disabled
                    className="w-full px-4 py-3 rounded-xl border border-[#F3E6E6] text-[#B0A0A0] text-sm bg-[#FBF6F4] cursor-not-allowed"
                />
            </div>

            {/* Editable fields */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-[#9A7A7A] uppercase tracking-wider mb-1.5">
                        First Name *
                    </label>
                    <input
                        {...register("firstName")}
                        placeholder="Jane"
                        className={`${inputCls} ${errors.firstName ? "border-red-300" : ""}`}
                    />
                    {errors.firstName && (
                        <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
                    )}
                </div>
                <div>
                    <label className="block text-xs font-bold text-[#9A7A7A] uppercase tracking-wider mb-1.5">
                        Last Name *
                    </label>
                    <input
                        {...register("lastName")}
                        placeholder="Doe"
                        className={`${inputCls} ${errors.lastName ? "border-red-300" : ""}`}
                    />
                    {errors.lastName && (
                        <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
                    )}
                </div>

                {/* Username — now editable */}
                <div className="col-span-2">
                    <label className="block text-xs font-bold text-[#9A7A7A] uppercase tracking-wider mb-1.5">
                        Username *
                        <span className="ml-2 text-[0.6rem] normal-case font-normal text-[#C08080] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                            Must be unique
                        </span>
                    </label>
                    <input
                        {...register("username")}
                        placeholder="janedoe"
                        className={`${inputCls} ${errors.username ? "border-red-300" : ""}`}
                    />
                    {errors.username && (
                        <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>
                    )}
                </div>

                <div className="col-span-2">
                    <label className="block text-xs font-bold text-[#9A7A7A] uppercase tracking-wider mb-1.5">
                        Phone Number
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B0A0A0]">
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                            </svg>
                        </span>
                        <input
                            {...register("phone")}
                            placeholder="98XXXXXXXX"
                            className={`${inputCls} pl-10 ${errors.phone ? "border-red-300" : ""}`}
                        />
                    </div>
                    {errors.phone && (
                        <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={pending}
                className="w-full py-3 rounded-full bg-[#6B4E4E] text-white text-sm font-semibold hover:bg-[#5A3A3A] disabled:opacity-60 transition-colors shadow-sm"
            >
                {pending ? "Saving changes…" : "Save Changes"}
            </button>
        </form>
    );
}