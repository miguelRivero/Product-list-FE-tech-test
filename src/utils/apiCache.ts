/**
 * Simple in-memory cache for API responses
 * Helps reduce redundant API calls and improve performance
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class APICache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes default

  /**
   * Generate cache key from endpoint and params
   */
  private getCacheKey(endpoint: string, params?: Record<string, unknown>): string {
    if (!params || Object.keys(params).length === 0) {
      return endpoint;
    }
    const paramStr = JSON.stringify(params);
    return `${endpoint}:${paramStr}`;
  }

  /**
   * Get cached data if available and not expired
   */
  get<T>(endpoint: string, params?: Record<string, unknown>): T | null {
    const key = this.getCacheKey(endpoint, params);
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now > entry.timestamp + entry.ttl) {
      // Expired, remove from cache
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set cache entry
   */
  set<T>(
    endpoint: string,
    data: T,
    params?: Record<string, unknown>,
    ttl: number = this.defaultTTL
  ): void {
    const key = this.getCacheKey(endpoint, params);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Invalidate cache for a specific endpoint
   */
  invalidate(endpoint: string, params?: Record<string, unknown>): void {
    const key = this.getCacheKey(endpoint, params);
    this.cache.delete(key);
  }

  /**
   * Invalidate all cache entries matching a pattern
   */
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size (number of entries)
   */
  size(): number {
    return this.cache.size;
  }
}

export const apiCache = new APICache();
