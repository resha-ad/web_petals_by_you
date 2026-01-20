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
