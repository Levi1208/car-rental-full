import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSearchStore } from "../search";

describe("Search Store", () => {
  const referenceDateString = "2026-08-02";
  const beforeRun = () => {
    setActivePinia(createPinia());

    vi.useFakeTimers();
    const referenceDate = new Date(referenceDateString);
    vi.setSystemTime(referenceDate);
  };
  const afterRun = () => {
    vi.useRealTimers();
  };

  beforeEach(beforeRun);
  afterEach(afterRun);

  it("can get the current date", () => {
    const { refreshCurrentDateString } = useSearchStore();

    expect(refreshCurrentDateString()).toBe(referenceDateString);
  });

  describe("detects errors", () => {
    beforeEach(beforeRun);
    afterEach(afterRun);


    it("has no errors", () => {
      const searchStore = useSearchStore();
      searchStore.refreshCurrentDateString();
      searchStore.fromDate = "2026-08-03";
      searchStore.toDate = "2026-08-04";

      expect(searchStore.hasErrors).toBe(false);
      expect(searchStore.errors.length).toBe(0);
    });

    it("has start date before current date", () => {
      const searchStore = useSearchStore();
      searchStore.refreshCurrentDateString();
      searchStore.fromDate = "2026-07-31";
      searchStore.toDate = "2026-08-04";

      expect(searchStore.hasErrors).toBe(true);
      expect(searchStore.errors.length).toBe(1);
    });

    it("has end date before start date", () => {
      const searchStore = useSearchStore();
      searchStore.refreshCurrentDateString();
      searchStore.fromDate = "2026-08-04";
      searchStore.toDate = "2026-08-03";

      expect(searchStore.hasErrors).toBe(true);
      expect(searchStore.errors.length).toBe(1);
    });

    it("has multiple errors (start date before current & end date before start date)", () => {
      const searchStore = useSearchStore();
      searchStore.refreshCurrentDateString();
      searchStore.fromDate = "2026-07-31";
      searchStore.toDate = "2026-07-30";

      expect(searchStore.hasErrors).toBe(true);
      expect(searchStore.errors.length).toBeGreaterThanOrEqual(2);
    });


    it("has invalid date or date format", () => {
      const searchStore = useSearchStore();
      searchStore.refreshCurrentDateString();
      searchStore.fromDate = "a";
      searchStore.toDate = "2026-08-04";

      expect(searchStore.hasErrors).toBe(true);
      expect(searchStore.errors.length).toBe(1);
    });
  });
});
