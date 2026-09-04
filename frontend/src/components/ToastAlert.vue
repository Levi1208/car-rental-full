<script setup lang="ts">
import { useAlertsStore, type RegisteredAlert } from '@/stores/alerts';
import { onMounted, onUnmounted } from 'vue';

const { removeAlert } = useAlertsStore();

const { alert } = defineProps<{alert: RegisteredAlert}>();

let timeoutID: ReturnType<typeof setTimeout> | null = null;

onMounted(() => {
  timeoutID = setTimeout(() => {
    removeAlert(alert.id);
  }, alert.timeout ?? 3000);
});

function clearAlertTimeout() {
  clearTimeout(timeoutID as ReturnType<typeof setTimeout>);
  timeoutID = null;
}

onUnmounted(clearAlertTimeout);
</script>

<template>
  <div :class="`user-select-none toast show text-bg-${alert.type}`">
    <div class="d-flex">
      <div class="toast-body">
        {{ alert.message }}
      </div>
      <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close" @click="() => {
        clearAlertTimeout();
        removeAlert(alert.id);
      }"></button>
    </div>
  </div>
</template>
