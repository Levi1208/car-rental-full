<script setup lang="ts">
import CarCard from "@/components/CarCard.vue";
import { useCarsQuery } from "@/queries/cars";
import { useAlertsStore } from "@/stores/alerts";
import { useSearchStore } from "@/stores/search";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { differenceInCalendarDays } from "date-fns";
import { useBookMutation, type BookingRequestDetails } from "@/mutations/book";

const router = useRouter();
const id = useRoute().params.id as string;

const { cars, carsLoading, carsError } = useCarsQuery();
const car = computed(() => cars.value?.[id]);

const { mutateAsync: book } = useBookMutation();

const searchStore = useSearchStore();
const alertsStore = useAlertsStore();

const formBooking = ref({
  name: "",
  email: "",
  address: "",
  phone: "",
  start_date: searchStore.fromDate,
  end_date: searchStore.toDate,
});

async function submitBooking() {
  const bookingData: BookingRequestDetails = {
    car_id: car.value!.id,
    ...formBooking.value
  };

  try {
    await book(bookingData);
    router.push({ name: "public" });
    alertsStore.addAlert({message: "Sikeres foglalás", type: "success"});
  } catch {
    alertsStore.addAlert({message: "Sikertelen foglalás", type: "danger"})
  }

}

</script>

<template>
  <div v-if="carsError || (!carsLoading && !car)" class="alert alert-danger">Az autó nem található.</div>
  <div v-else-if="carsLoading">Autó betöltése...</div>
  <div v-else-if="car" class="row">
    <div class="col-12 col-md-6 col-lg-5">
      <CarCard v-bind="{car}"></CarCard>
    </div>
    <form class="col-12 col-md-6 col-lg-7 d-flex flex-column gap-4 pt-4 pt-md-0 mb-4" @submit.prevent="submitBooking">
      <h1>Foglalás</h1>

      <div>
        <label for="name" class="form-label">
          Név
        </label>
        <input v-model="formBooking.name" class="form-control" type="text" name="name" id="name" required>
      </div>

      <div>
        <label for="email" class="form-label">
          E-mail cím
        </label>
        <input v-model="formBooking.email" class="form-control" type="email" name="email" id="email" required>
      </div>

      <div>
        <label for="address" class="form-label">
          Cím
        </label>
        <input v-model="formBooking.address" class="form-control" type="text" name="address" id="address" required>
      </div>

      <div>
        <label for="phone" class="form-label">
          Telefonszám
        </label>
        <input v-model="formBooking.phone" class="form-control" type="tel" name="phone" id="phone" required>
      </div>

      <div>
        <label for="from" class="form-label">
          Foglalás első napja
        </label>
        <input v-model="formBooking.start_date" class="form-control" type="date" name="from" id="from" required :min="searchStore.refreshCurrentDateString()" :max="formBooking.end_date">
      </div>

      <div>
        <label for="to" class="form-label">
          Foglalás utolsó napja
        </label>
        <input v-model="formBooking.end_date" class="form-control" type="date" name="to" id="to" required :min="formBooking.start_date">
      </div>

      <div>
        <label for="sum" class="form-label fst-italic">
          Foglalás teljes összege
        </label>
        <div class="input-group">
          <input type="text" class="form-control text-end" :value="searchStore.hasErrors ? '-' : ((differenceInCalendarDays(searchStore.toDate, searchStore.fromDate) + 1) * car.daily_price_huf).toLocaleString('hu')" id="sum" readonly>
          <div class="input-group-text">Ft</div>
        </div>
      </div>

      <button class="btn btn-primary" type="submit">Rendelés véglegesítése</button>
    </form>
  </div>
</template>
