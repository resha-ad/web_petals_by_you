"use server";

import { cookies } from "next/headers";

export interface UserData {
    _id: string;
    email: string;
    username: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    [key: string]: any;
}

// 7 days in seconds — matches a typical JWT expiry
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

export const setAuthToken = async (token: string) => {
    const cookieStore = await cookies();

    cookieStore.set({
        name: "auth_token",
        value: token,
        httpOnly: true,
        path: "/",
        maxAge: TOKEN_MAX_AGE,       // ← expires after 7 days
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });
};

export const getAuthToken = async () => {
    const cookieStore = await cookies();
    return cookieStore.get("auth_token")?.value || null;
};

export const setUserData = async (userData: UserData) => {
    const cookieStore = await cookies();

    cookieStore.set({
        name: "user_data",
        value: JSON.stringify(userData),
        httpOnly: true,
        path: "/",
        maxAge: TOKEN_MAX_AGE,       // ← same expiry as auth_token
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });
};

export const getUserData = async (): Promise<UserData | null> => {
    const cookieStore = await cookies();
    const userData = cookieStore.get("user_data")?.value || null;
    return userData ? JSON.parse(userData) : null;
};

export const clearAuthCookies = async () => {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    cookieStore.delete("user_data");
};