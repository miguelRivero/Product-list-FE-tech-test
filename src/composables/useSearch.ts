import { ref, watch } from "vue";

import { SEARCH_DEBOUNCE_DELAY } from "@/utils/constants";
import { useDebounceFn } from "@vueuse/core";

/**
 * Composable for search functionality with debouncing
 * Uses VueUse's useDebounceFn for better Vue integration
 * @param onSearch - Callback function to execute on search
 * @param delay - Debounce delay in milliseconds (default: SEARCH_DEBOUNCE_DELAY)
 */
export function useSearch(
  onSearch: (query: string) => void,
  delay = SEARCH_DEBOUNCE_DELAY
) {
  const searchQuery = ref("");

  // Debounced search function using VueUse
  const debouncedSearch = useDebounceFn((query: string) => {
    onSearch(query);
  }, delay);

  // Watch for search query changes
  watch(searchQuery, newQuery => {
    if (newQuery.trim() === "") {
      // Clear search immediately if query is empty
      onSearch("");
    } else {
      debouncedSearch(newQuery);
    }
  });

  return {
    searchQuery,
  };
}
