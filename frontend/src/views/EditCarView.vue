<script setup lang="ts">
import CarCard from "@/components/CarCard.vue";
import { useCreateCarMutation } from "@/mutations/createCar";
import { useEditCarMutation } from "@/mutations/editCar";
import { useCarsQuery } from "@/queries/cars";
import { useAlertsStore } from "@/stores/alerts";
import type { Car } from "@/stores/Car";
import { ref, watch, type Ref } from "vue";
import { useRoute } from "vue-router";

const { create = false } = defineProps<{create: boolean}>()

const id: string = useRoute().params.id as string ?? "-1";
const { cars, carsLoading, carsError } = useCarsQuery();

const { addAlert } = useAlertsStore();

const { mutateAsync: editCar, selectedCarID } = useEditCarMutation();
const { mutateAsync: createCar } = useCreateCarMutation();

const formBase = {brand: "", model: "", passengers: 0, daily_price_huf: 0, image: "", enabled: false};

type FormCar = Omit<Car, "id"> & {id?: number};
const formCar: Ref<FormCar> = create ? ref<FormCar>(formBase) : ref(cars.value?.[id] ? {...cars.value[id]} : formBase);

const wasEnabled = formCar.value.enabled;

async function submitHandler() {
  try {
    let res;
    if (create) {
      res = createCar(formCar.value);
    } else {
      delete formCar.value.id;
      selectedCarID.value = Number(id);
      res = editCar(formCar.value);
    }
    await res;
    addAlert({type: "success", message: `Az autó ${create ? "létrehozása" : "szerkesztése"} sikeres.`});
  } catch (err) {
    addAlert({type: "danger", message: "A művelet sikertelen."});
  }
}

watch(cars, (newValue) => {
  if (create) return;
  if (newValue?.[id]) formCar.value = {...newValue[id]};
})
</script>

<template>
  <div v-if="carsError || (!carsLoading && !formCar)" class="alert alert-danger">Az autó nem található.</div>
  <div v-else-if="carsLoading">Autó betöltése...</div>
  <div v-else-if="formCar" class="row">
    <div class="col-12 col-md-6 col-lg-5">
      <CarCard  v-bind="{car: formCar}"></CarCard>
    </div>
    <form class="col-12 col-md-6 col-lg-7 d-flex flex-column gap-4 pt-4 pt-md-0 mb-4" @submit.prevent="submitHandler">
      <h1 v-if="create">Új autó felvétele</h1>
      <h1 v-else>Autó szerkesztése</h1>

      <div>
        <label for="brand" class="form-label">
          Márka
        </label>
        <input v-model="formCar.brand" class="form-control" type="text" name="brand" id="brand" required>
      </div>

      <div>
        <label for="model" class="form-label">
          Modell
        </label>
        <input v-model="formCar.model" class="form-control" type="text" name="model" id="model" required>
      </div>

      <div>
        <label for="passengers" class="form-label">
          Utasok
        </label>
        <input v-model="formCar.passengers" class="form-control" type="number" name="passengers" id="passengers" min="1">
      </div>

      <div>
        <label for="daily_price_huf" class="form-label">
          Napi ár
        </label>
        <input v-model="formCar.daily_price_huf" class="form-control" type="number" name="daily_price_huf" id="daily_price_huf" min="0">
      </div>

      <div>
        <label for="image" class="form-label">
          Kép (URL)
        </label>
        <input v-model="formCar.image" class="form-control" type="url" name="image" id="image">
      </div>

      <div>
        <input v-model="formCar.enabled" class="form-check-input" type="checkbox" name="enabled" id="enabled">
        <label for="enabled" class="form-check-label">
          Aktiválva
        </label>
        <div v-show="!create && !formCar.enabled && wasEnabled" class="alert alert-warning">
          Az autó deaktiválása törli az autóra vonatkozó jövőbeli foglalásokat.
        </div>
      </div>

      <button class="btn btn-primary" type="submit">{{ create ? "Létrehozás" : "Adatok mentése" }}</button>
    </form>
  </div>
</template>

<style scoped>

</style>
