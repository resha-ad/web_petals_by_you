// lib/actions/custom-bouquet-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import * as customApi from "../api/custom-bouquet";

interface AddCustomBouquetResult {
    success: boolean;
    message?: string;
    data?: any; // can be cart or order item
}

export async function addCustomBouquetToCartAction(payload: any) {
    try {
        // minimal validation here
        if (!payload.flowers?.length) {
            return { success: false, message: "At least one flower is required" };
        }
        if (!payload.wrapping?.id) {
            return { success: false, message: "Please select a wrapping" };
        }

        const result = await customApi.addCustomBouquetToCart(payload);

        if (result.success) {
            // Revalidate cart and possibly other pages
            revalidatePath("/cart");
            revalidatePath("/build"); // optional - fresh state

            return {
                success: true,
                message: "Custom bouquet added to cart",
                data: result.data,
            };
        }

        return { success: false, message: result.message || "Failed to add to cart" };
    } catch (err: any) {
        return {
            success: false,
            message: err.message || "Server error while adding custom bouquet",
        };
    }
}