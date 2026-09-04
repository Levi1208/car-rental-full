import { describe, expect, it } from "vitest";

import { useAlertsStore } from "../alerts";
import { beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";

describe("Alerts Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("registers alert", () => {
    const alertsStore = useAlertsStore();
    const id = alertsStore.addAlert({type: "success", message: "Siker"});

    const registeredAlert = alertsStore.alerts.find(alert => alert.id === id);
    expect(registeredAlert).toBeDefined();
    expect(registeredAlert?.id).toBe(id);
    expect(registeredAlert?.type).toBe("success");
    expect(registeredAlert?.message).toBe("Siker");
  });

  it("removes alert", () => {
    const alertsStore = useAlertsStore();
    alertsStore.alerts = [{id: 1, type: "success", message: "Siker"}];

    alertsStore.removeAlert("test-id");

    expect(alertsStore.alerts.some(alert => alert.id === 1)).toBe(false);
  });
});
