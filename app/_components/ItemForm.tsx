"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"] as const;

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
    images: z
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

type ExistingItem = {
    _id: string;
    name: string;
    description: string;
    price: number;
    discountPrice?: number | null;
    category?: string;
    stock: number;
    isFeatured: boolean;
    isAvailable?: boolean | null;
    images: string[];
    createdAt?: string;
    updatedAt?: string;
    preparationTime?: number | null;
    deliveryType?: string | null;
    createdBy?: { username?: string; email?: string } | null;
};

type ItemFormProps = {
    initialData?: Partial<ExistingItem>;
    defaultValues?: Partial<ItemFormData>;
    onSubmit: (data: FormData) => Promise<{ success: boolean; message?: string }>;
    buttonText: string;
};

export default function ItemForm({ defaultValues = {}, onSubmit, buttonText }: ItemFormProps) {
    const [pending, startTransition] = useTransition();
    const [previews, setPreviews] = useState<string[]>([]);

    const form = useForm<ItemFormData>({
        resolver: zodResolver(itemSchema) as any,
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            discountPrice: null,
            category: "",
            stock: 0,
            isFeatured: false,
            images: [],
            ...defaultValues,
        },
        mode: "onChange",
    });

    const { register, handleSubmit, setValue, formState: { errors } } = form;

    const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setValue("images", files, { shouldValidate: true });

        const urls = files.map((file) => URL.createObjectURL(file));
        setPreviews(urls);

        return () => urls.forEach(URL.revokeObjectURL);
    };

    const onValidSubmit = (data: ItemFormData) => {
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

            data.images?.forEach((file) => {
                formData.append("images", file);
            });

            const res = await onSubmit(formData);
            if (res.success) {
                toast.success("Success!");
                form.reset();
            } else {
                toast.error(res.message || "Operation failed");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-6">
            {/* Name */}
            <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Name *</label>
                <input
                    {...register("name")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#6B4E4E] focus:border-[#E8B4B8] focus:ring-1 focus:ring-[#E8B4B8] outline-none"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Description */}
            <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Description *</label>
                <textarea
                    {...register("description")}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#6B4E4E] focus:border-[#E8B4B8] focus:ring-1 focus:ring-[#E8B4B8] outline-none"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>

            {/* Price & Discount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Price (NPR) *</label>
                    <input
                        type="number"
                        step="1"
                        {...register("price", { valueAsNumber: true })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#6B4E4E] focus:border-[#E8B4B8] focus:ring-1 focus:ring-[#E8B4B8] outline-none"
                    />
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Discount Price (NPR)</label>
                    <input
                        type="number"
                        step="1"
                        {...register("discountPrice", { valueAsNumber: true })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#6B4E4E] focus:border-[#E8B4B8] focus:ring-1 focus:ring-[#E8B4B8] outline-none"
                    />
                </div>
            </div>

            {/* Category & Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Category</label>
                    <select
                        {...register("category")}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#6B4E4E] focus:border-[#E8B4B8] focus:ring-1 focus:ring-[#E8B4B8] outline-none bg-white"
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
                    <label className="block mb-1 text-sm font-medium text-gray-700">Stock</label>
                    <input
                        type="number"
                        {...register("stock", { valueAsNumber: true })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#6B4E4E] focus:border-[#E8B4B8] focus:ring-1 focus:ring-[#E8B4B8] outline-none"
                    />
                </div>
            </div>

            {/* Featured Checkbox */}
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="isFeatured"
                    {...register("isFeatured")}
                    className="h-4 w-4 text-[#E8B4B8] focus:ring-[#E8B4B8] border-gray-300 rounded"
                />
                <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                    Mark as Featured
                </label>
            </div>

            {/* Images */}
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Images (multiple allowed)
                </label>
                <input
                    type="file"
                    multiple
                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                    onChange={handleFilesChange}
                    className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2.5 file:px-5
            file:rounded-lg file:border-0
            file:text-sm file:font-medium
            file:bg-[#E8B4B8]/10 file:text-[#6B4E4E]
            hover:file:bg-[#E8B4B8]/20 cursor-pointer"
                />
                {errors.images && (
                    <p className="text-red-500 text-sm mt-1">{errors.images.message?.toString()}</p>
                )}

                {/* Preview */}
                {previews.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3">
                        {previews.map((src, idx) => (
                            <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                                <img src={src} alt={`preview ${idx}`} className="object-cover w-full h-full" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={pending}
                className="w-full py-3.5 bg-[#E8B4B8] text-white font-medium rounded-full hover:bg-[#d9a3a7] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {pending ? "Saving..." : buttonText}
            </button>
        </form>
    );
}