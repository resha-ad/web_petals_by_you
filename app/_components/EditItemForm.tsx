// app/_components/EditItemForm.tsx
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/jpg", "image/png", "image/webp"] as const;
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
    discountPrice: z.coerce.number().nonnegative("Must be ≥ 0").nullable().optional(),
    category: z.string().optional(),
    stock: z.coerce.number().int().nonnegative("Stock must be non-negative").default(0),
    isFeatured: z.boolean().default(false),
    preparationTime: z.coerce.number().int().nonnegative().optional(),
    newImages: z
        .array(z.instanceof(File))
        .refine((f) => f.every((x) => x.size <= MAX_FILE_SIZE), "Each image max 5 MB")
        .refine((f) => f.every((x) => ACCEPTED.includes(x.type as any)), "Only jpg/png/webp")
        .optional()
        .default([]),
});

type ItemFormData = z.infer<typeof itemSchema>;

type EditItemFormProps = {
    initialData: any;
    onSubmit: (data: FormData) => Promise<{ success: boolean; message?: string }>;
    buttonText: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// ── shared style helpers (identical to EditUserForm) ──────────────────────
const inputCls = (err?: string) =>
    `w-full px-3 py-2 rounded-lg border ${err ? "border-red-300" : "border-[#E8D4D4]"
    } text-[#6B4E4E] text-sm outline-none focus:border-[#C4A0A0] focus:ring-1 focus:ring-[#E8D4D4] bg-white transition-colors placeholder:text-[#C0B0B0]`;

const labelCls =
    "block text-[0.68rem] font-bold text-[#9A7A7A] uppercase tracking-wider mb-1.5";

const errCls = "text-[0.68rem] text-red-500 mt-1";

export default function EditItemForm({ initialData, onSubmit, buttonText }: EditItemFormProps) {
    const [pending, startTransition] = useTransition();
    const [existingImages, setExistingImages] = useState<string[]>(initialData?.images || []);
    const [removedImages, setRemovedImages] = useState<string[]>([]);
    const [newPreviews, setNewPreviews] = useState<string[]>([]);
    const fileRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm<ItemFormData>({
        resolver: zodResolver(itemSchema) as any,
        defaultValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
            price: initialData?.price || 0,
            discountPrice: initialData?.discountPrice ?? null,
            category: initialData?.category || "",
            stock: initialData?.stock || 0,
            isFeatured: initialData?.isFeatured ?? false,
            preparationTime: initialData?.preparationTime ?? undefined,
            newImages: [],
        },
        mode: "onChange",
    });

    const removeExisting = (imgPath: string, idx: number) => {
        setExistingImages((prev) => prev.filter((_, i) => i !== idx));
        setRemovedImages((prev) => [...prev, imgPath]);
    };

    const handleNewFiles = (files: File[]) => {
        setValue("newImages", files, { shouldValidate: true });
        setNewPreviews(files.map((f) => URL.createObjectURL(f)));
    };

    const clearNewFiles = () => {
        setValue("newImages", [], { shouldValidate: true });
        setNewPreviews([]);
        if (fileRef.current) fileRef.current.value = "";
    };

    const onValidSubmit = (data: ItemFormData) => {
        const total = existingImages.length + (data.newImages?.length || 0);
        if (total > MAX_IMAGES) {
            toast.error(`Maximum ${MAX_IMAGES} images allowed (existing + new)`);
            return;
        }
        startTransition(async () => {
            const fd = new FormData();
            fd.append("name", data.name);
            fd.append("description", data.description);
            fd.append("price", data.price.toString());
            if (data.discountPrice != null) fd.append("discountPrice", data.discountPrice.toString());
            if (data.category) fd.append("category", data.category);
            fd.append("stock", data.stock.toString());
            fd.append("isFeatured", data.isFeatured ? "1" : "0");
            if (data.preparationTime != null) fd.append("preparationTime", data.preparationTime.toString());

            data.newImages?.forEach((f) => fd.append("images", f));
            existingImages.forEach((img) => fd.append("existingImages", img));
            removedImages.forEach((img) => fd.append("removedImages", img));

            const res = await onSubmit(fd);
            if (res.success) {
                toast.success("Product updated successfully!");
            } else {
                toast.error(res.message || "Failed to update product");
            }
        });
    };

    const totalImages = existingImages.length + newPreviews.length;

    return (
        <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-5">

            {/* ── Image management panel ── */}
            <div className="p-4 bg-[#FBF6F4] rounded-xl border border-[#F3E6E6]">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <p className="text-sm font-semibold text-[#6B4E4E]">Product Images</p>
                        <p className="text-[0.68rem] text-[#9A7A7A] mt-0.5">
                            {totalImages} / {MAX_IMAGES} — jpg / png / webp · max 5 MB each
                        </p>
                    </div>
                    {totalImages < MAX_IMAGES && (
                        <Controller
                            name="newImages"
                            control={control}
                            render={() => (
                                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#6B4E4E] text-white text-xs font-semibold cursor-pointer hover:bg-[#5A3A3A] transition-colors">
                                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    Add Images
                                    <input
                                        ref={fileRef}
                                        type="file"
                                        multiple
                                        accept={ACCEPTED.join(",")}
                                        className="sr-only"
                                        onChange={(e) => handleNewFiles(Array.from(e.target.files || []))}
                                    />
                                </label>
                            )}
                        />
                    )}
                </div>

                {/* Image grid */}
                {(existingImages.length > 0 || newPreviews.length > 0) ? (
                    <div className="flex flex-wrap gap-2">
                        {/* Existing */}
                        {existingImages.map((img, i) => (
                            <div key={`existing-${i}`} className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-[#EDD8D8] group">
                                <img
                                    src={`${API_BASE}${img}`}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                <button
                                    type="button"
                                    onClick={() => removeExisting(img, i)}
                                    className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center leading-none opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
                                >
                                    ×
                                </button>
                                {/* "saved" label */}
                                <div className="absolute bottom-0 left-0 right-0 bg-[#6B4E4E]/70 py-0.5 text-[0.5rem] text-white text-center">
                                    saved
                                </div>
                            </div>
                        ))}

                        {/* New files */}
                        {newPreviews.map((src, i) => (
                            <div key={`new-${i}`} className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-[#E8B4B8] group">
                                <img src={src} alt="" className="w-full h-full object-cover" />
                                <div className="absolute bottom-0 left-0 right-0 bg-[#E8B4B8]/80 py-0.5 text-[0.5rem] text-white text-center">
                                    new
                                </div>
                            </div>
                        ))}

                        {/* Clear new button */}
                        {newPreviews.length > 0 && (
                            <button
                                type="button"
                                onClick={clearNewFiles}
                                className="text-[0.68rem] text-red-400 hover:text-red-500 self-center ml-1"
                            >
                                Clear new
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-[0.72rem] text-[#B0A0A0]">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        No images — click Add Images to upload
                    </div>
                )}

                {errors.newImages && <p className={errCls}>{String(errors.newImages.message)}</p>}
            </div>

            {/* ── Fields grid ── */}
            <div className="grid grid-cols-2 gap-4">

                {/* Name — full width */}
                <div className="col-span-2">
                    <label className={labelCls}>Product Name *</label>
                    <input {...register("name")} className={inputCls(errors.name?.message)} />
                    {errors.name && <p className={errCls}>{errors.name.message}</p>}
                </div>

                {/* Price */}
                <div>
                    <label className={labelCls}>Price (NPR) *</label>
                    <input type="number" step="1" min="0" {...register("price")} className={inputCls(errors.price?.message)} />
                    {errors.price && <p className={errCls}>{errors.price.message}</p>}
                </div>

                {/* Discount Price */}
                <div>
                    <label className={labelCls}>Discount Price (NPR)</label>
                    <input type="number" step="1" min="0" {...register("discountPrice")} placeholder="Leave blank if none" className={inputCls(errors.discountPrice?.message)} />
                    {errors.discountPrice && <p className={errCls}>{errors.discountPrice.message}</p>}
                </div>

                {/* Category */}
                <div>
                    <label className={labelCls}>Category</label>
                    <select {...register("category")} className={`${inputCls()} cursor-pointer`}>
                        {CATEGORIES.map((c) => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                    </select>
                </div>

                {/* Stock */}
                <div>
                    <label className={labelCls}>Stock</label>
                    <input type="number" min="0" {...register("stock")} className={inputCls(errors.stock?.message)} />
                    {errors.stock && <p className={errCls}>{errors.stock.message}</p>}
                </div>

                {/* Preparation Time */}
                <div className="col-span-2">
                    <label className={labelCls}>Preparation Time (minutes)</label>
                    <input type="number" step="1" min="0" {...register("preparationTime")} placeholder="e.g. 30" className={inputCls(errors.preparationTime?.message)} />
                    {errors.preparationTime && <p className={errCls}>{errors.preparationTime.message}</p>}
                </div>

                {/* Description — full width */}
                <div className="col-span-2">
                    <label className={labelCls}>Description *</label>
                    <textarea
                        {...register("description")}
                        rows={4}
                        className={`${inputCls(errors.description?.message)} resize-none`}
                    />
                    {errors.description && <p className={errCls}>{errors.description.message}</p>}
                </div>
            </div>

            {/* ── Featured toggle ── */}
            <div className="flex items-center gap-3 px-4 py-3 bg-[#FBF6F4] rounded-xl border border-[#F3E6E6]">
                <div className="relative">
                    <input
                        type="checkbox"
                        id="isFeatured"
                        {...register("isFeatured")}
                        className="sr-only peer"
                    />
                    <label
                        htmlFor="isFeatured"
                        className="flex w-9 h-5 bg-[#E8D4D4] peer-checked:bg-[#6B4E4E] rounded-full cursor-pointer transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-transform peer-checked:after:translate-x-4 after:shadow-sm"
                    />
                </div>
                <div>
                    <p className="text-sm font-semibold text-[#6B4E4E]">Mark as Featured</p>
                    <p className="text-[0.68rem] text-[#9A7A7A]">Featured products appear on the home page</p>
                </div>
            </div>

            {/* ── Submit ── */}
            <button
                type="submit"
                disabled={pending}
                className="w-full py-2.5 rounded-full bg-[#6B4E4E] text-white text-sm font-semibold hover:bg-[#5A3A3A] disabled:opacity-60 transition-colors"
            >
                {pending ? "Saving…" : buttonText}
            </button>
        </form>
    );
}