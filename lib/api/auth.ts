import { LoginData, RegisterData } from "@/app/(auth)/schema/auth.schema";
import axios from "./axios";
import { API } from "./endpoints";

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

export const whoAmI = async () => {
    try {
        const response = await axios.get(API.AUTH.WHOAMI);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch current user");
    }
};

export const updateProfile = async (formData: FormData) => {
    try {
        const response = await axios.put(API.AUTH.UPDATEPROFILE, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Profile update failed");
    }
};