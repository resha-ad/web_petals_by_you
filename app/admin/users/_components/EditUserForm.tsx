"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { handleUpdateUser } from "@/lib/actions/admin/user-action";
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const editUserSchema = z.object({
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

type EditUserData = z.infer<typeof editUserSchema>;

export default function EditUserForm({ user }: { user: any }) {
    const [pending, startTransition] = useTransition();
    const [preview, setPreview] = useState<string | null>(user?.imageUrl || null);
    const fileRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm<EditUserData>({
        resolver: zodResolver(editUserSchema),
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

    const onSubmit = (data: EditUserData) => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("firstName", data.firstName);
            formData.append("lastName", data.lastName);
            formData.append("username", data.username);
            formData.append("email", data.email);
            if (data.image) {
                formData.append("image", data.image);
            }

            const res = await handleUpdateUser(user._id, formData);
            if (res.success) {
                toast.success("User updated successfully");
                if (fileRef.current) fileRef.current.value = "";
            } else {
                toast.error(res.message || "Update failed");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Image preview */}
            <div className="flex items-center gap-4">
                {preview ? (
                    <div className="relative">
                        <img
                            src={preview}
                            alt="Current or preview"
                            className="w-24 h-24 rounded-full object-cover border-2 border-[#E8B4B8]/30"
                        />
                        <button
                            type="button"
                            onClick={() => handleImageChange(undefined)}
                            className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow"
                        >
                            ×
                        </button>
                    </div>
                ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                        No image
                    </div>
                )}
            </div>

            {/* File input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Change Profile Image (optional)
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
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#E8B4B8]/20 file:text-[#6B4E4E] hover:file:bg-[#E8B4B8]/30 cursor-pointer"
                        />
                    )}
                />
                {errors.image && (
                    <p className="text-xs text-rose-500 mt-1 font-medium">
                        {errors.image.message}
                    </p>
                )}
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm text-gray-700 mb-2">First Name</label>
                    <input {...register("firstName")} className="w-full px-4 py-3 text-[#6B4E4E] rounded-lg border border-gray-200 focus:border-[#E8B4B8] outline-none" />
                    {errors.firstName && <p className="text-xs text-rose-400 mt-1">{errors.firstName.message}</p>}
                </div>

                <div>
                    <label className="block text-sm text-gray-700 mb-2">Last Name</label>
                    <input {...register("lastName")} className="w-full px-4 py-3 text-[#6B4E4E] rounded-lg border border-gray-200 focus:border-[#E8B4B8] outline-none" />
                    {errors.lastName && <p className="text-xs text-rose-400 mt-1">{errors.lastName.message}</p>}
                </div>

                <div>
                    <label className="block text-sm text-gray-700 mb-2">Username</label>
                    <input {...register("username")} className="w-full px-4 py-3 text-[#6B4E4E] rounded-lg border border-gray-200 focus:border-[#E8B4B8] outline-none" />
                    {errors.username && <p className="text-xs text-rose-400 mt-1">{errors.username.message}</p>}
                </div>

                <div>
                    <label className="block text-sm text-gray-700 mb-2">Email</label>
                    <input {...register("email")} type="email" className="w-full px-4 py-3 text-[#6B4E4E] rounded-lg border border-gray-200 focus:border-[#E8B4B8] outline-none" />
                    {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>}
                </div>
            </div>

            <button
                type="submit"
                disabled={pending}
                className="w-full py-3 rounded-full bg-[#E8B4B8] text-white font-medium hover:bg-[#D9A3A7] disabled:opacity-50 transition"
            >
                {pending ? "Updating..." : "Update User"}
            </button>
        </form>
    );
}
