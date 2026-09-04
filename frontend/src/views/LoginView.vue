<script setup lang="ts">
import { useLoginMutation } from "@/mutations/login";
import { useAlertsStore } from "@/stores/alerts";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const { addAlert } = useAlertsStore();

const username = ref("");
const password = ref("");

const { mutateAsync: login } = useLoginMutation();

async function loginHandler() {
  try {
    await login({ username: username.value, password: password.value});
    router.push({name: "admin"});
    addAlert({type: "success", message: "Sikeres bejelentkezés!"});
  } catch (err) {
    console.debug(`${err}`); // TODO
    addAlert({type: "danger", message: "Sikertelen bejelentkezés!"});
  }
}

</script>

<template>
  <div class="d-flex justify-content-center">
    <form @submit.prevent="loginHandler" class="border rounded-4 gap-3 col-12 col-sm-auto p-3 d-flex flex-column mt-4 mt-lg-0">
      <h1 class="fs-5 text-center">Bejelentkezés</h1>

      <div class="form-floating">
        <input v-model="username" type="text" name="username" id="username" class="form-control" placeholder="Felhasználónév">
        <label for="username" class="form-label">
          Felhasználónév
        </label>
      </div>

      <div class="form-floating">
        <input v-model="password" type="password" name="password" id="password" class="form-control" placeholder="Jelszó">
        <label for="password" class="form-label">
          Jelszó
        </label>
      </div>

      <button type="submit" class="btn btn-primary">Bejelentkezés</button>
    </form>
  </div>
</template>
