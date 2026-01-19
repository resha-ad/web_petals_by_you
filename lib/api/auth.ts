import api from "./axios"

interface RegisterData {
    email: string;
    password: string;
    role?: string;
}

interface LoginData {
    email: string;
    password: string;
}

interface UserResponse {
    id: string;
    email: string;
    role: string;
    message?: string;
}

interface LoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
        role: string;
    };
}

export const registerUser = (data: RegisterData) => {
    return api.post<UserResponse>("/auth/register", data);
};

export const loginUser = (data: LoginData) => {
    return api.post<LoginResponse>("/auth/login", data);
};