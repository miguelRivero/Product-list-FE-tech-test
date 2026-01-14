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
