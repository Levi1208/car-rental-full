<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from "vue-router";
import { useAlertsStore } from "./stores/alerts";
import { storeToRefs } from "pinia";
import ToastAlert from "@/components/ToastAlert.vue"
import { useAuthStore } from "./stores/auth.ts";
import { useSearchStore } from "./stores/search.ts";
import { onMounted } from "vue";

const authStore = useAuthStore();
const { isLoggedIn } = storeToRefs(authStore)
const alertsStore = useAlertsStore();
const { alerts } = storeToRefs(alertsStore);

const { refreshCurrentDateString } = useSearchStore();

onMounted(() => {
  refreshCurrentDateString();
})

const router = useRouter();

function logoutHandler() {
  router.push({name: "public"})
  authStore.logout();
  alertsStore.addAlert({ type: "info", message: "Kijelentkezve!"});
}

</script>

<template>
  <div class="">
    <header>
      <nav class="navbar navbar-expand shadow mb-4 bg-body-tertiary">
        <div class="container-fluid">
          <RouterLink to="/" class="navbar-brand">Autókölcsönző&trade;</RouterLink>
          <RouterLink v-if="!isLoggedIn" to="/login" class="btn btn-outline-primary">Bejelentkezés</RouterLink>
          <button v-else type="button" @click="logoutHandler" class="btn btn-outline-warning">Kijelentkezés</button>
        </div>
      </nav>
    </header>
    <div class="container-fluid mb-4 fixed-bottom pe-none">
      <div class="d-flex flex-column-reverse align-items-center">
        <TransitionGroup name="alerts">
          <div v-for="alert in alerts" :key="alert.id" class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
            <ToastAlert v-bind="{alert}" class="w-100 mw-100" />
          </div>
        </TransitionGroup>
      </div>
    </div>
    <div class="container-fluid">
      <RouterView :key="$route.fullPath">
      </RouterView>
    </div>
  </div>
</template>

<style lang="scss">
$color-mode-type: media-query;
//$primary: rgb(113, 53, 209);
$font-family-base: "Manrope";

@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap');

@import "bootstrap/scss/bootstrap.scss";
</style>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.alerts-move, /* apply transition to moving elements */
.alerts-enter-active,
.alerts-leave-active {
  transition: all 0.5s ease;
}

.alerts-leave-active {
  transition: all 0.2s ease;
}

.alerts-move {
  transition: all 0.1s ease;
}

.alerts-enter-from,
.alerts-leave-to {
  opacity: 0;
}

.alerts-enter-from {
  transform: translateY(-30px);
}

.alerts-leave-to {
  transform: translateY(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.alerts-leave-active {
  position: absolute;
}
</style>
