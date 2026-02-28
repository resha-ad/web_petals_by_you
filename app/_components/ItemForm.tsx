// app/_components/ItemForm.tsx
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition, useRef } from "react";
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
    images: z
        .array(z.instanceof(File))
        .refine((f) => f.every((x) => x.size <= MAX_FILE_SIZE), "Each image max 5 MB")
        .refine((f) => f.every((x) => ACCEPTED.includes(x.type as any)), "Only jpg/png/webp")
        .optional()
        .default([]),
});

type ItemFormData = z.infer<typeof itemSchema>;

type ItemFormProps = {
    defaultValues?: Partial<ItemFormData>;
    onSubmit: (data: FormData) => Promise<{ success: boolean; message?: string }>;
    buttonText: string;
};

// ── shared style helpers (same as CreateUserForm) ──────────────────────────
const inputCls = (err?: string) =>
    `w-full px-3 py-2 rounded-lg border ${err ? "border-red-300" : "border-[#E8D4D4]"
    } text-[#6B4E4E] text-sm outline-none focus:border-[#C4A0A0] focus:ring-1 focus:ring-[#E8D4D4] bg-white transition-colors placeholder:text-[#C0B0B0]`;

const labelCls =
    "block text-[0.68rem] font-bold text-[#9A7A7A] uppercase tracking-wider mb-1.5";

const errCls = "text-[0.68rem] text-red-500 mt-1";

export default function ItemForm({ defaultValues = {}, onSubmit, buttonText }: ItemFormProps) {
    const [pending, startTransition] = useTransition();
    const [previews, setPreviews] = useState<string[]>([]);
    const fileRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors },
    } = useForm<ItemFormData>({
        resolver: zodResolver(itemSchema) as any,
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            discountPrice: null,
            category: "",
            stock: 0,
            isFeatured: false,
            preparationTime: undefined,
            images: [],
            ...defaultValues,
        },
        mode: "onChange",
    });

    const handleFiles = (files: File[]) => {
        setValue("images", files, { shouldValidate: true });
        const urls = files.map((f) => URL.createObjectURL(f));
        setPreviews(urls);
    };

    const removePreview = (idx: number) => {
        setPreviews((prev) => {
            const next = prev.filter((_, i) => i !== idx);
            return next;
        });
        // Reset the file input so form value stays consistent
        if (fileRef.current) fileRef.current.value = "";
        setValue("images", [], { shouldValidate: true });
    };

    const onValidSubmit = (data: ItemFormData) => {
        if ((data.images?.length ?? 0) > MAX_IMAGES) {
            toast.error(`Maximum ${MAX_IMAGES} images allowed`);
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
            data.images?.forEach((f) => fd.append("images", f));

            const res = await onSubmit(fd);
            if (res.success) {
                toast.success("Product created successfully");
                reset();
                setPreviews([]);
                if (fileRef.current) fileRef.current.value = "";
            } else {
                toast.error(res.message || "Operation failed");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-5">

            {/* ── Image upload row (mirrors avatar row in CreateUserForm) ── */}
            <div className="p-4 bg-[#FBF6F4] rounded-xl border border-[#F3E6E6]">
                <p className="text-sm font-semibold text-[#6B4E4E] mb-2">
                    Product Images
                    <span className="ml-2 text-[0.68rem] font-normal text-[#B0A0A0]">
                        (up to {MAX_IMAGES} · jpg / png / webp · max 5 MB each)
                    </span>
                </p>

                <Controller
                    name="images"
                    control={control}
                    render={() => (
                        <input
                            ref={fileRef}
                            type="file"
                            multiple
                            accept={ACCEPTED.join(",")}
                            onChange={(e) => handleFiles(Array.from(e.target.files || []))}
                            className="text-xs text-[#9A7A7A] file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#F3E6E6] file:text-[#6B4E4E] hover:file:bg-[#EDD8D8] cursor-pointer"
                        />
                    )}
                />
                {errors.images && <p className={errCls}>{String(errors.images.message)}</p>}

                {previews.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {previews.map((src, i) => (
                            <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#EDD8D8]">
                                <img src={src} alt="" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removePreview(i)}
                                    className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center leading-none hover:bg-red-600"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Core fields grid ── */}
            <div className="grid grid-cols-2 gap-4">

                {/* Name — full width */}
                <div className="col-span-2">
                    <label className={labelCls}>Product Name *</label>
                    <input {...register("name")} placeholder="e.g. Summer Rose Bouquet" className={inputCls(errors.name?.message)} />
                    {errors.name && <p className={errCls}>{errors.name.message}</p>}
                </div>

                {/* Price */}
                <div>
                    <label className={labelCls}>Price (NPR) *</label>
                    <input type="number" step="1" min="0" {...register("price")} placeholder="0" className={inputCls(errors.price?.message)} />
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
                    <input type="number" min="0" {...register("stock")} placeholder="0" className={inputCls(errors.stock?.message)} />
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
                        placeholder="Describe this product…"
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
                className="w-full py-2.5 rounded-full bg-[#6B4E4E] text-white text-sm font-semibold hover:bg-[#5A3A3A] disabled:opacity-60 transition-colors mt-2"
            >
                {pending ? "Saving…" : buttonText}
            </button>
        </form>
    );
}