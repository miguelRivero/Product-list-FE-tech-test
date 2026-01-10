/**
 * Secure ID generator for client-side created entities
 * Uses crypto.randomUUID() for cryptographically secure IDs
 */
import { CLIENT_ID_RANGE } from "./constants";

/**
 * Generate a secure random ID for client-side created products
 * Returns a positive integer to avoid conflicts with API IDs (which are typically < 10000)
 */
export function generateSecureClientId(): number {
  // Use crypto.randomUUID() and convert to a number
  // We'll use the first 8 hex characters as a base for the ID
  const uuid = crypto.randomUUID();
  const hexPart = uuid.replace(/-/g, "").substring(0, 8);
  
  // Convert hex to number and ensure it's in the safe range
  const numericId = parseInt(hexPart, 16);
  const rangeSize = CLIENT_ID_RANGE.MAX - CLIENT_ID_RANGE.MIN + 1;
  
  // Map to range to avoid conflicts with API IDs
  const mappedId = CLIENT_ID_RANGE.MIN + (numericId % rangeSize);
  
  return mappedId;
}

/**
 * Check if an ID is a client-generated ID
 */
export function isClientGeneratedId(id: number): boolean {
  return id >= CLIENT_ID_RANGE.MIN && id < CLIENT_ID_RANGE.MAX + 1;
}
