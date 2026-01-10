import { z } from "zod";

/**
 * Validation schemas for product data
 */
export const productFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less")
    .trim(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(5000, "Description must be 5000 characters or less")
    .trim(),
  price: z
    .number()
    .min(0, "Price must be 0 or greater")
    .max(999999, "Price must be 999999 or less"),
  discountPercentage: z
    .number()
    .min(0, "Discount must be 0 or greater")
    .max(100, "Discount must be 100% or less")
    .optional()
    .default(0),
  stock: z
    .number()
    .int("Stock must be an integer")
    .min(0, "Stock must be 0 or greater")
    .max(999999, "Stock must be 999999 or less"),
  category: z
    .string()
    .min(1, "Category is required")
    .trim(),
  brand: z.string().max(100, "Brand must be 100 characters or less").trim().optional(),
  tags: z.array(z.string().trim()).optional().default([]),
});

// ProductFormData type is defined in @/types/product
// This schema validates ProductFormData but doesn't redefine the type
export type ValidatedProductFormData = z.infer<typeof productFormSchema>;

/**
 * Validate product form data
 */
export function validateProductForm(data: unknown): {
  success: boolean;
  data?: ValidatedProductFormData;
  errors?: Record<string, string[]>;
} {
  const result = productFormSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string[]> = {};
  result.error.errors.forEach((error) => {
    const path = error.path.join(".");
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(error.message);
  });

  return { success: false, errors };
}

/**
 * Sanitize string input (basic sanitization)
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[\x00-\x1F\x7F]/g, "") // Remove control characters
    .replace(/\s+/g, " "); // Normalize whitespace
}
