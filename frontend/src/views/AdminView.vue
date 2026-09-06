<script setup lang="ts">
import CarCard from "@/components/CarCard.vue";
import { computed, onMounted, onUnmounted } from "vue";
import BookingInfo from "@/components/BookingInfo.vue";
import { useCarsQuery } from "@/queries/cars";
import { useBookingsQuery } from "@/queries/bookings";

const { cars, carsLoading, carsError, asAdmin } = useCarsQuery();
asAdmin.value = true;

const { bookings, bookingsLoading, bookingsError } = useBookingsQuery();

const now = new Date();
const day = now.getDate();
const month = now.getMonth() + 1;
const year = now.getFullYear();
const nowString = `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;

const bookingGroups = computed(() => {
  const future = [];
  const active = [];
  const past = [];

  for (const booking of bookings.value ?? []) {
    if (booking.start_date > nowString) future.push(booking);
    else if (booking.end_date < nowString) past.push(booking);
    else active.push(booking);
  }

  return [
    { bookings: future, name: "Jövőbeli foglalások" },
    { bookings: active, name: "Aktuális foglalások" },
    { bookings: past, name: "Múlt foglalások" }
  ];
});

onUnmounted(() => {
  asAdmin.value = false;
});

</script>

<template>
  <div v-if="bookingsError" class="alert alert-danger">
    A foglalások betöltése sikertelen.
  </div>
  <div v-else-if="bookingsLoading">
    Foglalások betöltése...
  </div>
  <div>

    <h1 class="mb-4">Foglalások</h1>
    <div v-if="bookings && bookings.length === 0" class="alert alert-secondary">
      Nincsenek foglalások.
    </div>
    <div v-else>

      <div v-for="group in bookingGroups" :key="group.name">
        <h2>{{ group.name }}</h2>
        <ul id="bookings" class="list-unstyled row g-1 g-sm-3">
          <li v-for="(booking, index) in group.bookings" :key="index" class="col-6 col-lg-4 col-xl-3 col-xxl-2 d-flex flex-column gap-1">
            <BookingInfo v-bind="{booking: {name: '', email: '', address: '', phone: '', total_price: 0, ...booking}}" />
          </li>
        </ul>
      </div>

    </div>

  </div>

  <div v-if="carsError" class="alert alert-danger">
    Az autók betöltése sikertelen. <small>({{ carsError }})</small>
  </div>
  <div v-else-if="carsLoading">
    Autók betöltése...
  </div>
  <div v-else>
    <h1 class="mb-4">Autók</h1>
    <ul id="cars" class="list-unstyled row g-1 g-sm-3">
      <li class="col-6 col-md-4 col-xl-3 col-xxl-2 d-flex flex-column gap-1">
        <RouterLink
          :to="{name: 'create-car'}"
          class="overflow-hidden btn btn-primary h-100 d-flex flex-column align-items-center justify-content-center"
        >
          <div class="fw-bold fs-1">&plus;</div>
          <div>Új autó felvétele</div>
        </RouterLink>
      </li>
      <li v-for="car in cars" :key="car.id" class="col-6 col-md-4 col-xl-3 col-xxl-2 d-flex flex-column gap-1">
        <CarCard v-bind="{car}" class="flex-grow-1">
          <template #admin-btn>
            <RouterLink :to="{name: 'edit-car', params: {id: car.id}}" class="btn btn-outline-primary">Szerkesztés&ensp;&#x1F4DD;</RouterLink>
          </template>
        </CarCard>
      </li>
    </ul>
  </div>
</template>
