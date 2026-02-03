import { LoginData, RegisterData } from "@/app/(auth)/schema/auth.schema";
import axios from "./axios";
import { API } from "./endpoints";
import { getAuthToken } from "@/lib/cookie"; // server cookie read

// Existing client-safe whoAmI (uses browser cookies via interceptor)
export const whoAmI = async () => {
    try {
        const response = await axios.get(API.AUTH.WHOAMI);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch current user");
    }
};

// New: Server-safe version (for server components)
export const serverWhoAmI = async () => {
    const token = await getAuthToken(); // safe on server
    if (!token) {
        return { success: false, message: "No token provided" };
    }

    try {
        const response = await axios.get(API.AUTH.WHOAMI, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        return { success: false, message: error.response?.data?.message || "Failed to fetch user" };
    }
};

export const register = async (data: RegisterData) => {
    try {
        const response = await axios.post(API.AUTH.REGISTER, data);
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Registration failed"
        );
    }
};

export const login = async (data: LoginData) => {
    try {
        const response = await axios.post(API.AUTH.LOGIN, data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Login failed");
    }
};

export const updateProfile = async (formData: FormData, token?: string) => {
    try {
        const headers: any = { "Content-Type": "multipart/form-data" };
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await axios.put(API.AUTH.UPDATEPROFILE, formData, { headers });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Profile update failed");
    }
};