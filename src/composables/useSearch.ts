import { ref, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";

/**
 * Composable for search functionality with debouncing
 * Uses VueUse's useDebounceFn for better Vue integration
 * @param onSearch - Callback function to execute on search
 * @param delay - Debounce delay in milliseconds (default: 300ms)
 */
export function useSearch(
  onSearch: (query: string) => void,
  delay = 300
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
    }, 100);
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

