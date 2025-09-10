import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .email("Invalid email address")
  .min(1)
  .max(255);

export const passwordSchema = z.string().trim().min(4);

export const profileSetupSchema = z.object({
  firstName: z.string().trim().min(1).max(225),
  lastName: z.string().trim().min(1).max(225),
  bgColor: z.number(),
  // email: emailSchema,
  // password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
