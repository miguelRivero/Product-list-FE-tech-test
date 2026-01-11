import { ref, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { SEARCH_DEBOUNCE_DELAY, SEARCH_STATE_RESET_DELAY } from "@/utils/constants";

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
  const isSearching = ref(false);

  // Debounced search function using VueUse
  const debouncedSearch = useDebounceFn((query: string) => {
    isSearching.value = true;
    onSearch(query);
    // Reset searching state after a short delay
    setTimeout(() => {
      isSearching.value = false;
    }, SEARCH_STATE_RESET_DELAY);
  }, delay);

  // Watch for search query changes
  watch(searchQuery, (newQuery) => {
    if (newQuery.trim() === "") {
      // Clear search immediately if query is empty
      onSearch("");
      isSearching.value = false;
    } else {
      debouncedSearch(newQuery);
    }
  });

  return {
    searchQuery,
    isSearching,
  };
}

