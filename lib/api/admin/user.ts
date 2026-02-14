import axios from "../axios";
import { API } from "../endpoints";
import { getAuthToken } from "@/lib/cookie"; // server-safe

const getHeaders = async () => {
    const token = await getAuthToken();
    return {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
};

export const createUser = async (formData: FormData) => {
    try {
        const headers = await getHeaders();
        const response = await axios.post(API.ADMIN.USERS.CREATE, formData, {
            ...headers,
            headers: { ...headers.headers, "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to create user");
    }
};

export const getAllUsers = async (query = "") => {
    try {
        const headers = await getHeaders();
        const url = query ? `${API.ADMIN.USERS.LIST}?${query}` : API.ADMIN.USERS.LIST;
        const response = await axios.get(url, headers);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch users");
    }
};

export const getUserById = async (id: string) => {
    try {
        const headers = await getHeaders();
        const response = await axios.get(API.ADMIN.USERS.GET_ONE(id), headers);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "User not found");
    }
};

export const updateUserById = async (id: string, formData: FormData) => {
    try {
        const headers = await getHeaders();
        const response = await axios.put(API.ADMIN.USERS.UPDATE(id), formData, {
            ...headers,
            headers: { ...headers.headers, "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Update failed");
    }
};

export const deleteUserById = async (id: string) => {
    try {
        const headers = await getHeaders();
        const response = await axios.delete(API.ADMIN.USERS.DELETE(id), headers);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Delete failed");
    }
};