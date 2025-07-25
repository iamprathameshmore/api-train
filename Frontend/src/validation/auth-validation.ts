// src/schemas/auth-schema.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
});

export const signupSchema = loginSchema.extend({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(15, { message: "Phone number must be no more than 15 digits" })
    .regex(/^[0-9+\-() ]+$/, {
      message: "Please enter a valid phone number",
    }),
});

// For verifying OTP (usually email or phone + OTP code)
export const verificationSchema = z.object({
  otp: z
    .string()
    .length(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^[0-9]+$/, { message: "OTP must be numeric" }),
});
