import { defineStore } from "pinia";
import { ref } from "vue";

type AlertType = "danger" | "success" | "info";

type Alert = {
  type: AlertType;
  message: string;
  timeout?: number;
};

export type RegisteredAlert = {
  id: number;
} & Alert;

export const useAlertsStore = defineStore("alerts", () => {
  const alerts = ref<RegisteredAlert[]>([]);

  function addAlert(alert: Alert) {
    const id = alerts.value.length === 0 ? 1 : Math.max(...alerts.value.map(alert => alert.id)) + 1;
    alerts.value.push({ id, ...alert });
    return id;
  }

  function removeAlert(id: number) {
    alerts.value.splice(alerts.value.findIndex(a => a.id === id), 1);
  }

  return { alerts, addAlert, removeAlert };
});
