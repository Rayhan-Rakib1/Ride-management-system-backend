import z from "zod";
import { Rider_Status } from "./rider.interface";

// Zod schema for creating a new rider
export const CreateRiderSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must not exceed 50 characters').nonempty('Name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.string().nonempty('Role is required'),
  phone: z.string().regex(/^\+?[\d\s-]{10,}$/, 'Invalid phone number format').nonempty('Phone number is required'),
  status: z.enum(Object.values(Rider_Status) as [string, ...string[]]).optional().default(Rider_Status.Active),
  gender: z.enum(['male', 'female', 'other']).optional(),
  address: z.string().max(100, 'Address must not exceed 100 characters').optional(),
  profileImage: z.string().url('Profile image must be a valid URL').optional(),
  dateOfBirth: z.string().refine((val) => !val || !isNaN(Date.parse(val)), { message: 'Invalid date of birth format' }).optional(),
  nationality: z.string().max(50, 'Nationality must not exceed 50 characters').optional(),
  auth: z.array(z.object({
    provider: z.string().nonempty('Provider is required'),
    providerId: z.string().nonempty('ProviderId is required'),
  })).optional(),
});

// Zod schema for updating a rider
export const UpdateRiderSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must not exceed 50 characters').nonempty('Name cannot be empty').optional(),
  email: z.string().email('Valid email is required').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters long').optional(),
  role: z.string().nonempty('Role cannot be empty').optional(),
  phone: z.string().regex(/^\+?[\d\s-]{10,}$/, 'Invalid phone number format').nonempty('Phone number cannot be empty').optional(),
  status: z.enum(Object.values(Rider_Status) as [string, ...string[]]).optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  address: z.string().max(100, 'Address must not exceed 100 characters').optional(),
  profileImage: z.string().url('Profile image must be a valid URL').optional(),
  dateOfBirth: z.string().refine((val) => !val || !isNaN(Date.parse(val)), { message: 'Invalid date of birth format' }).optional(),
  nationality: z.string().max(50, 'Nationality must not exceed 50 characters').optional(),
  auth: z.array(z.object({
    provider: z.string().nonempty('Provider is required'),
    providerId: z.string().nonempty('ProviderId is required'),
  })).optional(),
});