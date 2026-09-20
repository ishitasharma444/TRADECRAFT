// TRADECRAFT Zod Validation Schemas for Form Inputs and Trading Operations
import { z } from 'zod';

export const SignupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  agreeTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must acknowledge the Terms and Privacy Policy' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const ResetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const ProfileUpdateSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  avatar: z.string(),
});

export const OrderSchema = z.object({
  assetId: z.string().min(1, 'Asset is required'),
  type: z.enum(['BUY', 'SELL']),
  quantity: z
    .number()
    .positive('Quantity must be greater than zero')
    .finite('Quantity must be a valid number')
    .max(100000, 'Order quantity exceeds maximum limit'),
  price: z
    .number()
    .positive('Price must be greater than zero')
    .finite('Price must be a valid number'),
});

export const AIMentorQuerySchema = z.object({
  message: z.string().min(2, 'Query is too short').max(500, 'Query exceeds 500 characters'),
  contextAssetId: z.string().optional(),
  contextScenarioId: z.string().optional(),
});
