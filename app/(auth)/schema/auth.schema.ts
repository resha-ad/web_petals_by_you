import { z } from "zod";

const phoneValidator = z
    .string()
    .optional()
    .refine(
        (val) => !val || /^(\+?977)?[0-9]{9,10}$/.test(val.replace(/[\s\-]/g, "")),
        { message: "Invalid phone number (e.g. 98XXXXXXXX)" }
    );

export const registerSchema = z
    .object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        username: z.string().min(3, "Username must be at least 3 characters"),
        email: z.string().email("Invalid email address"),
        phone: phoneValidator,
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export type RegisterData = z.infer<typeof registerSchema>;
export type LoginData = z.infer<typeof loginSchema>;