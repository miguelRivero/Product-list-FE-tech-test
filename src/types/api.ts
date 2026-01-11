/**
 * API response types
 */

export interface ApiErrorResponse {
  message?: string;
}

export interface ApiErrorData {
  message?: string;
  [key: string]: unknown;
}
