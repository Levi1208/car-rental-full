import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useAuthStore } from "../auth";

describe("Auth Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("sets token correctly, including localStorage", () => {
    const authStore = useAuthStore();
    authStore.setToken("fake-token");

    expect(authStore.token).toBe("fake-token");
    expect(localStorage.getItem("token")).toBe("fake-token");
  });

  it("logout clears token", () => {
    const authStore = useAuthStore();
    authStore.token = "fake-token";
    localStorage.setItem("token", "fake-token");

    authStore.logout();

    expect(authStore.token).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
  });
});
