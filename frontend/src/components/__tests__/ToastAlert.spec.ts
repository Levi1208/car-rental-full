import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createTestingPinia } from "@pinia/testing";

import ToastAlert from "../ToastAlert.vue";
import { mount } from "@vue/test-utils";
import { useAlertsStore } from "@/stores/alerts";
import { setActivePinia } from "pinia";

describe("ToastAlert", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const pinia = createTestingPinia({createSpy: vi.fn, stubActions: false});
  setActivePinia(pinia);

  const store = useAlertsStore();
  store.addAlert({type: "success", message: "Siker"});
  store.addAlert({type: "danger", message: "Hiba"});

  it("displays its message", () => {
    const wrapper = mount(ToastAlert, {
      props: {
        alert: store.alerts[0]!
      },
      global: {
        plugins: [pinia]
      }
    });

    expect(wrapper.text()).toContain("Siker");
  });

  it("applies the right styling", () => {
    const successWrapper = mount(ToastAlert, {
      props: {
        alert: store.alerts[0]!
      },
      global: {
        plugins: [pinia]
      }
    });

    expect(successWrapper.classes()).toContain("text-bg-success");

    const dangerWrapper = mount(ToastAlert, {
      props: {
        alert: store.alerts[1]!
      },
      global: {
        plugins: [pinia]
      }
    });

    expect(dangerWrapper.classes()).toContain("text-bg-danger");
  });

  it("removes the alert after the timeout", () => {
    const id = store.addAlert({type: "success", message: "Siker", timeout: 1000});
    expect(store.alerts.find(alert => alert.id === id)).toBeDefined();

    // oxlint-disable-next-line no-unused-vars
    const wrapper = mount(ToastAlert, {
      props: {
        alert: store.alerts.find(alert => alert.id === id)!
      },
      global: {
        plugins: [pinia]
      }
    });

    vi.advanceTimersByTime(1000);

    expect(store.alerts.find(alert => alert.id === id)).toBeUndefined();
  });

  it("removes the alert when closed", () => {
    const id = store.addAlert({type: "success", message: "Siker", timeout: 1000});
    expect(store.alerts.find(alert => alert.id === id)).toBeDefined();

    const wrapper = mount(ToastAlert, {
      props: {
        alert: store.alerts.find(alert => alert.id === id)!
      },
      global: {
        plugins: [pinia]
      }
    });
    wrapper.find("button").trigger("click");

    expect(store.alerts.find(alert => alert.id === id)).toBeUndefined();
  });
});
