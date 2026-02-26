import axios from "axios";
import Cookies from "js-cookie"; // ← new

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// axiosInstance.interceptors.request.use((config) => {
//     const token = Cookies.get("auth_token"); // client-safe read
//     console.log("[axios] Attaching token:", token ? "yes" : "no");
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// }, (error) => {
//     return Promise.reject(error);
// });

export default axiosInstance;