import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter an email address" })
    .email({ message: "Invalid email address" })
    .or(z.string().min(1, { message: "Username is required" })),

  password: z
    .string()
    .min(8, { message: "The password you provided must have at least 6 characters." })
    .max(100, { message: "The password you provided must have at most 200 characters." }),
});
