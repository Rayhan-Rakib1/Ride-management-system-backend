import z from "zod";
import { Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Name must be a string",
    })
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(20, { message: "Name cannot be more than 20 characters long" }),

  email: z
    .string({
      invalid_type_error: "Email must be a string",
    })
    .email({ message: "Must be a valid email address format" })
    .min(5, { message: "Email must be at least 5 characters long" })
    .max(30, { message: "Email cannot be more than 20 characters long" }),

  password: z
    .string({
      invalid_type_error: "Password must be a string",
    })
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must include at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must include at least one lowercase letter",
    })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must include at least one special character",
    }),

  
});


// update user
export const updateUserZodSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Name must be a string",
    })
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(20, { message: "Name cannot be more than 20 characters long" }).optional(),

  password: z
    .string({
      invalid_type_error: "Password must be a string",
    })
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must include at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must include at least one lowercase letter",
    })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must include at least one special character",
    }).optional(),

    role: z.enum(Object.values(Role) as [string]).optional(),

})