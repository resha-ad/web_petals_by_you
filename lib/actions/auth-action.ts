import { loginUser, registerUser } from "../api/auth";
import { clearAuthCookies, getAuthToken, getUserData, setAuthToken, setUserData } from "../cookie";

interface RegisterData {
    email: string;
    password: string;
    role?: string;
}

interface LoginData {
    email: string;
    password: string;
}

interface LoginResult {
    success: boolean;
    user?: any;
    token?: string;
    message?: string;
}

interface RegisterResult {
    success: boolean;
    message: string;
}

// Register action
export const registerAction = async (data: RegisterData): Promise<RegisterResult> => {
    try {
        const res = await registerUser(data);
        return { success: true, message: res.data.message || "Registration successful" };
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || "Registration failed" };
    }
};

// Login action
export const loginAction = async (data: LoginData): Promise<LoginResult> => {
    try {
        const res = await loginUser(data);
        const { token, user } = res.data;

        // Server-side cookie storage
        await setAuthToken(token);
        await setUserData(user);

        return { success: true, user, token };
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || "Login failed" };
    }
};

// Logout
export const logoutAction = async () => {
    await clearAuthCookies();
};

// Get current logged-in user
export const getLoggedInUser = async () => {
    const token = await getAuthToken();
    const user = await getUserData();
    return { token, user };
};