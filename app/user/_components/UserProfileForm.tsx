"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { handleUpdateProfile } from "@/lib/actions/auth-action";
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const userProfileSchema = z.object({
    firstName: z.string().min(1, "First name required"),
    lastName: z.string().min(1, "Last name required"),
    username: z.string().min(3, "Username min 3 characters"),
    email: z.string().email("Invalid email"),
    image: z
        .instanceof(File)
        .optional()
        .refine((f) => !f || f.size <= MAX_FILE_SIZE, "Max 5MB")
        .refine((f) => !f || ACCEPTED_IMAGE_TYPES.includes(f.type), "Only jpg/png/webp"),
});

type UserProfileData = z.infer<typeof userProfileSchema>;

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
        formState: { errors },
    } = useForm<UserProfileData>({
        resolver: zodResolver(userProfileSchema),
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            username: user?.username || "",
            email: user?.email || "",
        },
    });

    useEffect(() => {
        if (user?.imageUrl) {
            setPreview(`${process.env.NEXT_PUBLIC_API_BASE_URL}${user.imageUrl}`);
        }
    }, [user]);

    const handleImageChange = (file: File | undefined) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
            setValue("image", file, { shouldValidate: true });
        } else {
            setPreview(user?.imageUrl ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${user.imageUrl}` : null);
            setValue("image", undefined);
        }
    };

    const onSubmit = (data: UserProfileData) => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("firstName", data.firstName);
            formData.append("lastName", data.lastName);
            formData.append("username", data.username);
            formData.append("email", data.email);
            if (data.image) {
                formData.append("image", data.image);
            }

            const res = await handleUpdateProfile(formData);
            if (res.success) {
                toast.success("Profile updated successfully");
                if (fileRef.current) fileRef.current.value = "";
            } else {
                toast.error(res.message || "Update failed");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Image preview */}
            <div className="flex items-center justify-center gap-6">
                {preview ? (
                    <div className="relative">
                        <img
                            src={preview}
                            alt="Profile preview"
                            className="w-32 h-32 rounded-full object-cover border-4 border-[#E8B4B8]/30 shadow-md"
                        />
                        <button
                            type="button"
                            onClick={() => handleImageChange(undefined)}
                            className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg shadow"
                        >
                            ×
                        </button>
                    </div>
                ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg">
                        No Photo
                    </div>
                )}
            </div>

            {/* File input */}
            <div className="text-center">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Change Profile Photo (optional)
                </label>
                <Controller
                    name="image"
                    control={control}
                    render={({ field: { onChange } }) => (
                        <input
                            ref={fileRef}
                            type="file"
                            accept={ACCEPTED_IMAGE_TYPES.join(",")}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                handleImageChange(file);
                                onChange(file);
                            }}
                            className="block mx-auto text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#E8B4B8]/20 file:text-[#6B4E4E] hover:file:bg-[#E8B4B8]/30 cursor-pointer"
                        />
                    )}
                />
                {errors.image && (
                    <p className="text-xs text-rose-500 mt-2 font-medium">
                        {errors.image.message}
                    </p>
                )}
            </div>

            {/* Fields */}
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm text-gray-700 mb-2 font-medium">First Name</label>
                    <input
                        {...register("firstName")}
                        className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:border-[#E8B4B8] focus:ring-2 focus:ring-[#E8B4B8]/30 outline-none text-[#6B4E4E] text-base"
                        placeholder="Your first name"
                    />
                    {errors.firstName && <p className="text-xs text-rose-400 mt-1">{errors.firstName.message}</p>}
                </div>

                <div>
                    <label className="block text-sm text-gray-700 mb-2 font-medium">Last Name</label>
                    <input
                        {...register("lastName")}
                        className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:border-[#E8B4B8] focus:ring-2 focus:ring-[#E8B4B8]/30 outline-none text-[#6B4E4E] text-base"
                        placeholder="Your last name"
                    />
                    {errors.lastName && <p className="text-xs text-rose-400 mt-1">{errors.lastName.message}</p>}
                </div>

                <div>
                    <label className="block text-sm text-gray-700 mb-2 font-medium">Username</label>
                    <input
                        {...register("username")}
                        className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:border-[#E8B4B8] focus:ring-2 focus:ring-[#E8B4B8]/30 outline-none text-[#6B4E4E] text-base"
                        placeholder="Your username"
                    />
                    {errors.username && <p className="text-xs text-rose-400 mt-1">{errors.username.message}</p>}
                </div>

                <div>
                    <label className="block text-sm text-gray-700 mb-2 font-medium">Email</label>
                    <input
                        {...register("email")}
                        type="email"
                        className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:border-[#E8B4B8] focus:ring-2 focus:ring-[#E8B4B8]/30 outline-none text-[#6B4E4E] text-base"
                        placeholder="your.email@example.com"
                    />
                    {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>}
                </div>
            </div>

            <button
                type="submit"
                disabled={pending}
                className="w-full py-4 rounded-full bg-[#E8B4B8] text-white font-semibold text-lg hover:bg-[#D9A3A7] disabled:opacity-60 transition shadow-lg"
            >
                {pending ? "Updating Profile..." : "Save Changes"}
            </button>
        </form>
    );
}