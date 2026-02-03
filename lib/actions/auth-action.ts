"use server";

import { login, register, updateProfile, whoAmI } from "@/lib/api/auth";
import { LoginData, RegisterData } from "@/app/(auth)/schema/auth.schema";
import { setAuthToken, setUserData, clearAuthCookies } from "@/lib/cookie";
import { redirect } from "next/navigation";

export const handleRegister = async (data: RegisterData) => {
    try {
        const response = await register(data);

        if (response.success) {
            return {
                success: true,
                message: "Registration successful",
                data: response.data,
            };
        }

        return {
            success: false,
            message: response.message || "Registration failed",
        };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
};

export const handleLogin = async (data: LoginData) => {
    try {
        const response = await login(data);
        if (response.success) {
            await setAuthToken(response.token);
            await setUserData(response.data);

            // Role-based redirect
            const role = response.data.role;
            if (role === "admin") {
                return { success: true, message: "Login successful", redirectTo: "/admin" };
            } else {
                return { success: true, message: "Login successful", redirectTo: "/user/dashboard" };
            }
        }
        return { success: false, message: response.message || "Login failed" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
};

export const handleLogout = async () => {
    await clearAuthCookies();
    redirect("/login");
};

export async function handleWhoAmI() {
    try {
        const result = await whoAmI();
        if (result.success) {
            // Optionally update cookie if backend returns fresh data
            await setUserData(result.data);
            return { success: true, data: result.data };
        }
        return { success: false, message: result.message || "Failed to fetch user" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function handleUpdateProfile(formData: FormData) {
    try {
        const result = await updateProfile(formData);  // this comes from lib/api/auth.ts

        if (result.success) {
            // Update cookie with fresh user data
            await setUserData(result.data);
            return {
                success: true,
                message: "Profile updated successfully",
                data: result.data,
            };
        }

        return {
            success: false,
            message: result.message || "Profile update failed",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Something went wrong during profile update",
        };
    }
}