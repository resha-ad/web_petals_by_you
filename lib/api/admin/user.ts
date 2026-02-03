import axios from "../axios";
import { API } from "../endpoints";

export const createUser = async (formData: FormData) => {
    try {
        const response = await axios.post(API.ADMIN.USERS.CREATE, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to create user");
    }
};

export const getAllUsers = async () => {
    try {
        const response = await axios.get(API.ADMIN.USERS.LIST);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch users");
    }
};

export const getUserById = async (id: string) => {
    try {
        const response = await axios.get(API.ADMIN.USERS.GET_ONE(id));
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "User not found");
    }
};

export const updateUserById = async (id: string, formData: FormData) => {
    try {
        const response = await axios.put(API.ADMIN.USERS.UPDATE(id), formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Update failed");
    }
};

export const deleteUserById = async (id: string) => {
    try {
        const response = await axios.delete(API.ADMIN.USERS.DELETE(id));
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Delete failed");
    }
};