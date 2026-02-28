"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from "react";

interface User {
    _id: string;
    email: string;
    username: string;
    role: "user" | "admin";
    firstName?: string;
    lastName?: string;
    imageUrl?: string | null;
    phone?: string | null;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    refreshAuth: () => Promise<void>;
    /**
     * Clears local user state only.
     * The Navbar handleLogout() is responsible for:
     *   1. POST /api/logout  (deletes httpOnly cookies server-side)
     *   2. logout()          (clears this state)
     *   3. window.location.href = "/login"  (hard reload for clean remount)
     */
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/api/auth/whoami`, {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data.success ? (data.data as User) : null);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        }
    }, []);

    useEffect(() => {
        checkAuth().finally(() => setIsLoading(false));
    }, [checkAuth]);

    const refreshAuth = useCallback(async () => {
        await checkAuth();
    }, [checkAuth]);

    // Only clears local React state — no fetch, no redirect here.
    // Navbar.handleLogout() handles the full flow.
    const logout = useCallback(() => {
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, refreshAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};