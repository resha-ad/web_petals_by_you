// app/_components/EditItemForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition, useEffect } from "react";
import { toast } from "react-toastify";
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"] as const;
const MAX_IMAGES = 5;

const CATEGORIES = [
    { value: "", label: "Select a Category" },
    { value: "bouquets", label: "Bouquets" },
    { value: "flowers", label: "Flowers" },
    { value: "arrangements", label: "Arrangements" },
    { value: "gifts", label: "Gift Sets" },
    { value: "others", label: "Others" },
];

const itemSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    price: z.coerce.number().positive("Price must be a positive number"),
    discountPrice: z.coerce
        .number()
        .nonnegative("Discount price cannot be negative")
        .nullable()
        .optional(),
    category: z.string().optional(),
    stock: z.coerce.number().int().nonnegative("Stock must be non-negative").default(0),
    isFeatured: z.boolean().default(false),
    preparationTime: z.coerce
        .number()
        .int()
        .nonnegative("Preparation time must be non-negative")
        .optional(),
    newImages: z
        .array(z.instanceof(File))
        .refine((files) => files.every((f) => f.size <= MAX_FILE_SIZE), "Each image max 5MB")
        .refine(
            (files) => files.every((f) => ACCEPTED_IMAGE_TYPES.includes(f.type as any)),
            "Only .jpg, .jpeg, .png, .webp allowed"
        )
        .optional()
        .default([]),
});

type ItemFormData = z.infer<typeof itemSchema>;

type EditItemFormProps = {
    initialData: any;
    onSubmit: (data: FormData) => Promise<{ success: boolean; message?: string }>;
    buttonText: string;
};

export default function EditItemForm({ initialData, onSubmit, buttonText }: EditItemFormProps) {
    const [pending, startTransition] = useTransition();
    const [previews, setPreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>(initialData?.images || []);
    const [removedImages, setRemovedImages] = useState<string[]>([]);

    const form = useForm<ItemFormData>({
        resolver: zodResolver(itemSchema) as any,
        defaultValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
            price: initialData?.price || 0,
            discountPrice: initialData?.discountPrice ?? null,
            category: initialData?.category || "",
            stock: initialData?.stock || 0,
            isFeatured: initialData?.isFeatured ?? false,
            preparationTime: initialData?.preparationTime ?? null,
            newImages: [],
        },
        mode: "onChange",
    });

    const { register, handleSubmit, setValue, formState: { errors } } = form;

    // Load existing image previews
    useEffect(() => {
        if (initialData?.images?.length > 0) {
            const urls = initialData.images.map((img: string) =>
                `${process.env.NEXT_PUBLIC_API_BASE_URL}${img}`
            );
            setPreviews(urls);
        }
    }, [initialData?.images]);

    const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setValue("newImages", files, { shouldValidate: true });

        const newUrls = files.map((file) => URL.createObjectURL(file));
        setPreviews((prev) => [...prev, ...newUrls]);
    };

    const removeExistingImage = (imgPath: string, index: number) => {
        const newExisting = existingImages.filter((_, i) => i !== index);
        setExistingImages(newExisting);
        setRemovedImages((prev) => [...prev, imgPath]);
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const onValidSubmit = (data: ItemFormData) => {
        const totalImages = existingImages.length + (data.newImages?.length || 0);
        if (totalImages > MAX_IMAGES) {
            toast.error(`Maximum ${MAX_IMAGES} images allowed (existing + new)`);
            return;
        }

        startTransition(async () => {
            const formData = new FormData();

            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("price", data.price.toString());
            if (data.discountPrice !== null && data.discountPrice !== undefined) {
                formData.append("discountPrice", data.discountPrice.toString());
            }
            if (data.category) formData.append("category", data.category);
            formData.append("stock", data.stock.toString());

            // ✅ Fix: send "1" or "0" instead of "true"/"false"
            // z.coerce.boolean() treats "false" as true (truthy string),
            // but correctly maps 0 → false and 1 → true
            formData.append("isFeatured", data.isFeatured ? "1" : "0");

            if (data.preparationTime !== undefined) {
                formData.append("preparationTime", data.preparationTime.toString());
            }

            // New images
            data.newImages?.forEach((file) => {
                formData.append("images", file);
            });

            // Keep remaining existing images
            existingImages.forEach((img) => {
                formData.append("existingImages", img);
            });

            // Removed images
            removedImages.forEach((img) => {
                formData.append("removedImages", img);
            });

            const res = await onSubmit(formData);
            if (res.success) {
                toast.success("Item updated successfully!");
            } else {
                toast.error(res.message || "Failed to update item");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-6">
            {/* Name */}
            <div>
                <label className="block mb-1 text-sm font-medium text-[#6B4E4E]">Name *</label>
                <input
                    {...register("name")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-[#6B4E4E] focus:border-[#E8B4B8] focus:ring-1 focus:ring-[#E8B4B8] outline-none"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Description */}
            <div>
                <label className="block mb-1 text-sm font-medium text-[#6B4E4E]">Description *</label>
                <textarea
                    {...register("description")}
                    rows={5}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-[#6B4E4E] focus:border-[#E8B4B8] focus:ring-1 focus:ring-[#E8B4B8] outline-none"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>

            {/* Price & Discount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block mb-1 text-sm font-medium text-[#6B4E4E]">Price (NPR) *</label>
                    <input
                        type="number"
                        step="1"
                        {...register("price", { valueAsNumber: true })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-[#6B4E4E] focus:border-[#E8B4B8] focus:ring-1 focus:ring-[#E8B4B8] outline-none"
                    />
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium text-[#6B4E4E]">Discount Price (NPR)</label>
                    <input
                        type="number"
                        step="1"
                        {...register("discountPrice", { valueAsNumber: true })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-[#6B4E4E] focus:border-[#E8B4B8] focus:ring-1 focus:ring-[#E8B4B8] outline-none"
                    />
                    {errors.discountPrice && <p className="text-red-500 text-sm mt-1">{errors.discountPrice.message}</p>}
                </div>
            </div>

            {/* Category & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block mb-1 text-sm font-medium text-[#6B4E4E]">Category</label>
                    <select
                        {...register("category")}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-[#6B4E4E] focus:border-[#E8B4B8] focus:ring-1 focus:ring-[#E8B4B8] outline-none bg-white"
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium text-[#6B4E4E]">Stock</label>
                    <input
                        type="number"
                        {...register("stock", { valueAsNumber: true })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-[#6B4E4E] focus:border-[#E8B4B8] focus:ring-1 focus:ring-[#E8B4B8] outline-none"
                    />
                </div>
            </div>

            {/* Preparation Time */}
            <div>
                <label className="block mb-1 text-sm font-medium text-[#6B4E4E]">Preparation Time (minutes)</label>
                <input
                    type="number"
                    step="1"
                    {...register("preparationTime", { valueAsNumber: true })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-[#6B4E4E] focus:border-[#E8B4B8] focus:ring-1 focus:ring-[#E8B4B8] outline-none"
                    placeholder="e.g. 30"
                />
                {errors.preparationTime && <p className="text-red-500 text-sm mt-1">{errors.preparationTime.message}</p>}
            </div>

            {/* Featured Checkbox */}
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    id="isFeatured"
                    {...register("isFeatured")}
                    className="h-5 w-5 text-[#E8B4B8] focus:ring-[#E8B4B8] border-gray-300 rounded"
                />
                <label htmlFor="isFeatured" className="text-sm font-medium text-[#6B4E4E]">
                    Mark as Featured
                </label>
            </div>

            {/* Images */}
            <div>
                <label className="block mb-2 text-sm font-medium text-[#6B4E4E]">
                    Images (max {MAX_IMAGES} total – existing + new)
                </label>
                <input
                    type="file"
                    multiple
                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                    onChange={handleFilesChange}
                    className="block w-full text-sm text-[#6B4E4E]
            file:mr-4 file:py-2.5 file:px-5
            file:rounded-lg file:border-0
            file:text-sm file:font-medium
            file:bg-[#E8B4B8]/10 file:text-[#6B4E4E]
            hover:file:bg-[#E8B4B8]/20 cursor-pointer"
                />
                {errors.newImages && (
                    <p className="text-red-500 text-sm mt-1">{errors.newImages.message?.toString()}</p>
                )}

                {/* Previews */}
                {previews.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                        {previews.map((src, idx) => (
                            <div key={idx} className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                <img src={src} alt={`preview ${idx}`} className="object-cover w-full h-full" />
                                {idx < existingImages.length && (
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(existingImages[idx], idx)}
                                        className="absolute top-2 right-2 z-10 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow hover:bg-red-600 transition"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={pending}
                className="w-full py-3.5 bg-[#E8B4B8] text-white font-medium rounded-full hover:bg-[#D9A3A7] transition disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
                {pending ? "Updating..." : buttonText}
            </button>
        </form>
    );
}