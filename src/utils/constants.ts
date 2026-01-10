/**
 * Application constants
 */

// Dialog auto-close delay (in milliseconds)
export const DIALOG_AUTO_CLOSE_DELAY = 1000; // 1 second

// API Cache TTL (in milliseconds)
export const CACHE_TTL = {
  PRODUCTS_LIST: 5 * 60 * 1000, // 5 minutes
  PRODUCT_DETAIL: 10 * 60 * 1000, // 10 minutes
  CATEGORIES: 60 * 60 * 1000, // 1 hour
  SEARCH_RESULTS: 60 * 1000, // 1 minute
};

// Client ID generation range
export const CLIENT_ID_RANGE = {
  MIN: 10000,
  MAX: 99999,
};
