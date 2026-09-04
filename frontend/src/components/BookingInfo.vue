<script setup lang="ts">
import { useCarsQuery } from '@/queries/cars';
import type { BookingFull } from "@/stores/Booking";
import { computed } from 'vue';

const { booking } = defineProps<{booking: BookingFull}>()

const { cars } = useCarsQuery();
const car = computed(() => cars.value?.[`${booking.car_id}`]);
</script>

<template>
  <div class="card">
    <div class="card-header">
      <div class="d-flex flex-column align-items-center gap-2">
        <div class="d-flex align-items-center w-100 gap-2">
          <div>
            <small>
              {{ car?.brand }} {{ car?.model }}
            </small>
          </div>
          <div class="badge text-bg-info">
            Autó ID: {{ car?.id }}
          </div>
        </div>

        <div class="badge text-bg-warning">
          {{ new Date(booking.start_date).toLocaleDateString("hu").slice(0, -1) }}&ndash;<br class="d-sm-none">{{ new Date(booking.end_date).toLocaleDateString("hu") }}
        </div>
      </div>
    </div>
    <div class="list-group list-group-flush">
      <div class="list-group-item fw-bold">
        {{ booking.name }}
      </div>
      <div class="list-group-item">
        {{ booking.email }}
      </div>
      <div class="list-group-item">
        {{ booking.address }}
      </div>
      <div class="list-group-item">
        {{ booking.phone }}
      </div>
      <div class="list-group-item">
        {{ booking.total_price.toLocaleString("hu") }} Ft
      </div>
    </div>
  </div>
</template>
