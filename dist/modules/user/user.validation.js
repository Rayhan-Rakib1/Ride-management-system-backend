"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({
        invalid_type_error: "Name must be a string",
    })
        .min(2, { message: "Name must be at least 2 characters long" })
        .max(20, { message: "Name cannot be more than 20 characters long" }),
    email: zod_1.default
        .string({
        invalid_type_error: "Email must be a string",
    })
        .email({ message: "Must be a valid email address format" })
        .min(5, { message: "Email must be at least 5 characters long" })
        .max(30, { message: "Email cannot be more than 20 characters long" }),
    password: zod_1.default
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
exports.updateUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({
        invalid_type_error: "Name must be a string",
    })
        .min(2, { message: "Name must be at least 2 characters long" })
        .max(20, { message: "Name cannot be more than 20 characters long" }).optional(),
    password: zod_1.default
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
    role: zod_1.default.enum(Object.values(user_interface_1.Role)).optional(),
});
