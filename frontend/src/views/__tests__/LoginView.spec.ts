import { describe, expect, it, vi } from "vitest";

import LoginView from "../LoginView.vue";
import { mount, VueWrapper } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { useLoginMutation } from "@/mutations/login";
import { beforeEach } from "vitest";
import type { Pinia } from "pinia";
import { useAlertsStore } from "@/stores/alerts.ts";
import { useAuthStore } from "@/stores/auth.ts";

vi.mock("@/mutations/login");

describe("LoginView", () => {
  let wrapper: VueWrapper;
  let pinia: Pinia;

  beforeEach(() => {
    pinia = createTestingPinia({ createSpy: vi.fn, stubActions: true });

    vi.mocked(useLoginMutation).mockReturnValue({
      mutateAsync: vi.fn<() => Promise<unknown>>(async () => {})
    });

    wrapper = mount(LoginView, {
      global: {
        plugins: [pinia],
      }
    });
  });

  it("adds an alert when a login error is thrown", async () => {
    vi.mocked(useLoginMutation).mockReturnValue({
      mutateAsync: vi.fn<() => Promise<unknown>>(async () => { throw new Error(); })
    });

    wrapper = mount(LoginView, {
      global: {
        plugins: [pinia],
      }
    });

    const loginMutation = useLoginMutation();
    const alertsStore = useAlertsStore();

    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(loginMutation.mutateAsync).toHaveBeenCalled();
    expect(alertsStore.addAlert).toHaveBeenCalled();
  });

  it("calls login with the right username and password", async () => {
    const loginMutation = useLoginMutation();

    const usernameInput = wrapper.find<HTMLInputElement>("#username");
    const passwordInput = wrapper.find<HTMLInputElement>("#password");

    usernameInput.setValue("test username");
    passwordInput.setValue("test password");

    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(loginMutation.mutateAsync).toHaveBeenCalledWith({ username: "test username", password: "test password" });
  });

  it("adds an alert when login is successful", async () => {
    const loginMutation = useLoginMutation();
    const alertsStore = useAlertsStore();

    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(loginMutation.mutateAsync).toHaveBeenCalled();
    expect(alertsStore.addAlert).toHaveBeenCalled();
  });
});
