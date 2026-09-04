<script setup lang="ts">
import type { Car } from "@/stores/Car";

const { car } = defineProps<{car: Omit<Car, "id">}>();
</script>

<template>
  <div class="card rounded-3 overflow-hidden fs-6 bg-body d-flex flex-column">
    <img :src="car.image" alt="" class="card-img-top w-100 h-auto object-fit-cover" style="aspect-ratio: 3 / 2">
    <div class="d-flex flex-column flex-grow-1 position-relative">
      <div class="text-white fw-bold position-absolute bottom-100 end-0 px-2 m-1 rounded bg-black bg-opacity-50" style="text-shadow: 0 0 4px black">
        <span class="fs-3">{{ car.daily_price_huf.toLocaleString("hu") }}</span> <span>Ft/nap</span>
      </div>
      <div class="p-2">
        <span class="fw-bold">{{ car.brand }}</span> <span>{{ car.model }}</span><br>{{ car.passengers }} férőhely
      </div>
      <div v-show="$slots['view-btn'] || $slots['admin-btn']" class="mt-auto">
        <div id="btn-wrapper" class="d-flex flex-column p-1">
          <slot name="view-btn">

          </slot>
          <slot name="admin-btn">

          </slot>
        </div>
      </div>
    </div>
    </div>
</template>

<style scoped>
</style>
