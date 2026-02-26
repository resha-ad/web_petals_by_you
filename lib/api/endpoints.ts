export const API = {
    AUTH: {
        LOGIN: "/api/auth/login",
        REGISTER: "/api/auth/register",
        WHOAMI: "/api/auth/whoami",
        UPDATEPROFILE: "/api/auth/profile",  // changed to match your backend PUT /api/auth/profile
    },
    ADMIN: {
        USERS: {
            BASE: "/api/admin/users",
            CREATE: "/api/admin/users",
            LIST: "/api/admin/users",
            GET_ONE: (id: string) => `/api/admin/users/${id}`,
            UPDATE: (id: string) => `/api/admin/users/${id}`,
            DELETE: (id: string) => `/api/admin/users/${id}`,
        },
    },
    ITEMS: {
        LIST: "/api/items",
        CREATE: "/api/items",
        GET_ONE: (slug: string) => `/api/items/${slug}`,
        UPDATE: (id: string) => `/api/items/${id}`,
        DELETE: (id: string) => `/api/items/${id}`,
    },
};