"use server";

import { login, register, serverWhoAmI, updateProfile, whoAmI } from "@/lib/api/auth";
import { LoginData, RegisterData } from "@/app/(auth)/schema/auth.schema";
import { setAuthToken, setUserData, clearAuthCookies, getAuthToken } from "@/lib/cookie";
import { redirect } from "next/navigation";
import axios from "../api/axios";

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
        const result = await serverWhoAmI(); // server-safe version

        if (result.success) {
            // DO NOT setUserData here — only do it after login or update
            return { success: true, data: result.data };
        }

        return { success: false, message: result.message || "Failed to fetch user" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function handleUpdateProfile(formData: FormData) {
    try {
        const token = await getAuthToken();  // ← read token on server
        if (!token) {
            return { success: false, message: "No token provided - please log in again" };
        }

        const result = await updateProfile(formData, token); // ← pass token to api function

        if (result.success) {
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

export const handleForgotPassword = async (email: string) => {
    try {
        const response = await axios.post("/api/auth/forgot-password", { email });
        return response.data;
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to send reset email",
        };
    }
};

export const handleResetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await axios.post("/api/auth/reset-password", {
            token,
            newPassword,
        });
        return response.data;
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || "Password reset failed",
        };
    }
};
