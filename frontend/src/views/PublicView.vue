<script setup lang="ts">
import CarCard from "@/components/CarCard.vue";
import DaterangeInput from "@/components/DaterangeInput.vue";
import { storeToRefs } from "pinia";
import { useSearchStore } from "@/stores/search";
import { useCarsQuery } from "@/queries/cars";
import { useBookingsQuery } from "@/queries/bookings";

const { cars, carsLoading, carsError } = useCarsQuery();

//const { bookings, bookingsLoading, bookingsError } = useBookingsQuery();

const searchStore = useSearchStore();

const nowString = searchStore.refreshCurrentDateString();

searchStore.fromDate = nowString;
searchStore.toDate = nowString;

const { fromDate, toDate } = storeToRefs(searchStore);
/*
function dateRangesOverlap(fromA: string, toA: string, fromB: string, toB: string): boolean {
  return fromA <= toB && toA >= fromB;
}
 */
</script>

<template>
  <div v-if="carsError /* || bookingsError */" class="alert alert-danger">
    Az autók betöltése sikertelen. <small>({{ carsError }})</small>
  </div>
  <div v-else-if="carsLoading /* || bookingsLoading */">
    Autók betöltése...
  </div>
  <div v-else>

    <div class="d-flex justify-content-center row">
      <div class="col-12 col-sm-auto">
        <div class="border rounded p-1 p-sm-2 mb-4 d-flex flex-column align-items-center gap-2">
          <div class="fs-5">Foglalás időtartama</div>
          <DaterangeInput v-model:from-date="fromDate" v-model:to-date="toDate" />
        </div>
      </div>
    </div>

    <template v-if="searchStore.hasErrors">
      <div v-for="(error, index) in searchStore.errors" :key="index" class="alert alert-danger">
        {{ error }}
      </div>
    </template>
    <div v-else-if="/* bookings && */ cars">
      <h1 class="mb-4">Foglalható autók</h1>
      <div v-if="Object.values(cars).length === 0" class="alert alert-secondary">
        Nincsenek foglalható autók.
      </div>
      <ul v-else id="cars" class="list-unstyled row g-1 g-sm-3">
        <template v-for="car in cars" :key="car.id">
          <li
            v-show="/* bookings
              .filter(r => r.car === car.id)
              .some(r => dateRangesOverlap(r.start_date, r.end_date, fromDate, toDate)) === false */true"
            class="col-6 col-md-4 col-xl-3 col-xxl-2"
          >
            <CarCard v-bind="{car}" class="h-100">
              <template #view-btn>
                <RouterLink :to="{name: 'rent', params: {id: car.id}}" class="btn btn-primary">Foglalás</RouterLink>
              </template>
            </CarCard>
          </li>
        </template>
      </ul>
    </div>

  </div>
</template>
