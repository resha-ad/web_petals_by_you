// lib/api/axios.ts
import axios from "axios";
import { cookies } from "next/headers"; // keep this

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Only attach token interceptor on the server
if (typeof window === "undefined") {
    axiosInstance.interceptors.request.use(async (config) => {
        try {
            // ──── Important: await cookies() ────
            const cookieStore = await cookies();           // ← await here
            const token = cookieStore.get("auth_token")?.value;

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                // Optional debug 
                console.log("[server axios] Token attached:", token.substring(0, 10) + "...");
            } else {
                // Optional: log when missing 
                console.log("[server axios] No auth_token found in cookies");
            }
        } catch (err) {
            console.error("[axios interceptor] Failed to read cookies:", err);
        }

        return config;
    }, (error) => {
        return Promise.reject(error);
    });
}

export default axiosInstance;