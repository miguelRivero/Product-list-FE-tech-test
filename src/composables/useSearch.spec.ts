import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SEARCH_DEBOUNCE_DELAY } from "@/utils/constants";
import { nextTick } from "vue";
import { useSearch } from "./useSearch";

describe("useSearch", () => {
  let onSearch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    onSearch = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("initializes with empty search query", () => {
    const { searchQuery } = useSearch(onSearch);

    expect(searchQuery.value).toBe("");
  });

  it("calls onSearch immediately when query changes to empty", async () => {
    const { searchQuery } = useSearch(onSearch);

    // First set a non-empty value
    searchQuery.value = "test";
    await nextTick();

    // Then change to empty (should trigger watch immediately, not debounced)
    searchQuery.value = "";
    await nextTick();
    await vi.runOnlyPendingTimersAsync();

    expect(onSearch).toHaveBeenCalledWith("");
  });

  it("calls onSearch immediately when query is trimmed to empty", async () => {
    const { searchQuery } = useSearch(onSearch);

    searchQuery.value = "   ";
    await nextTick();
    await vi.runOnlyPendingTimersAsync();

    expect(onSearch).toHaveBeenCalledWith("");
  });

  it("debounces search when query is not empty", async () => {
    const { searchQuery } = useSearch(onSearch);

    searchQuery.value = "test";
    await nextTick();

    // Should not be called immediately
    expect(onSearch).not.toHaveBeenCalled();

    // Fast-forward time to trigger debounce
    await vi.advanceTimersByTimeAsync(SEARCH_DEBOUNCE_DELAY);
    await nextTick();

    // Now should be called
    expect(onSearch).toHaveBeenCalledWith("test");
  });

  it("uses custom delay when provided", async () => {
    const customDelay = 500;
    const { searchQuery } = useSearch(onSearch, customDelay);

    searchQuery.value = "test";
    await nextTick();

    // Should not be called immediately
    expect(onSearch).not.toHaveBeenCalled();

    // Fast-forward less than custom delay
    await vi.advanceTimersByTimeAsync(customDelay - 100);
    await nextTick();
    expect(onSearch).not.toHaveBeenCalled();

    // Fast-forward to custom delay
    await vi.advanceTimersByTimeAsync(100);
    await nextTick();

    expect(onSearch).toHaveBeenCalledWith("test");
  });

  it("debounces multiple rapid changes", async () => {
    const { searchQuery } = useSearch(onSearch);

    searchQuery.value = "t";
    await nextTick();
    searchQuery.value = "te";
    await nextTick();
    searchQuery.value = "tes";
    await nextTick();
    searchQuery.value = "test";
    await nextTick();

    // Should not be called yet
    expect(onSearch).not.toHaveBeenCalled();

    // Fast-forward time
    await vi.advanceTimersByTimeAsync(SEARCH_DEBOUNCE_DELAY);
    await nextTick();

    // Should only be called once with the last value
    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith("test");
  });

  it("clears search immediately when changing from non-empty to empty", async () => {
    const { searchQuery } = useSearch(onSearch);

    searchQuery.value = "test";
    await nextTick();

    // Fast-forward to trigger debounced search
    await vi.advanceTimersByTimeAsync(SEARCH_DEBOUNCE_DELAY);
    await nextTick();

    expect(onSearch).toHaveBeenCalledWith("test");
    onSearch.mockClear();

    // Change to empty
    searchQuery.value = "";
    await nextTick();
    await vi.runOnlyPendingTimersAsync();

    // Should be called immediately with empty string (not debounced)
    expect(onSearch).toHaveBeenCalledWith("");
  });
});
