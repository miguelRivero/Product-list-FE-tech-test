import { apiCache } from "@/utils/apiCache";
import { logger } from "@/utils/logger";

/**
 * Product Store Helpers
 * Utility functions for common store operations
 * Extracted to reduce complexity and improve maintainability
 */

/**
 * Handles product-related errors with consistent logging
 * @param error - The error that occurred
 * @param operation - Description of the operation that failed
 * @param context - Additional context data for logging
 */
export function handleProductError(
  error: unknown,
  operation: string,
  context?: Record<string, unknown>
): string {
  const errorMessage =
    error instanceof Error ? error.message : "Unknown error occurred";
  const errorInstance =
    error instanceof Error ? error : new Error(errorMessage);

  logger.error(`Error ${operation}`, errorInstance, {
    operation,
    ...context,
  });

  return errorMessage;
}

/**
 * Invalidates product-related caches
 * @param productId - Optional product ID to invalidate specific product cache
 */
export function invalidateProductCaches(productId?: number): void {
  if (productId) {
    apiCache.invalidate(`/products/${productId}`);
  }
  // Always invalidate product list cache when any product changes
  apiCache.invalidatePattern("^/products");
}

/**
 * Performs an optimistic update with automatic rollback on error
 * @param backup - The original state to restore on error
 * @param operation - The async operation to perform
 * @param rollback - Function to restore the backup state
 * @returns Promise that resolves when operation completes or rejects on error
 */
export async function optimisticUpdate<T>(
  backup: T,
  operation: () => Promise<void>,
  rollback: (backup: T) => void
): Promise<void> {
  try {
    await operation();
  } catch (error) {
    // Rollback on error
    rollback(backup);
    throw error;
  }
}

/**
 * Creates a safe error message from an unknown error
 * @param error - The error to extract message from
 * @param defaultMessage - Default message if error cannot be extracted
 * @returns Error message string
 */
export function getErrorMessage(
  error: unknown,
  defaultMessage: string = "An error occurred"
): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return defaultMessage;
}
