// import { defineStore } from "pinia";
// import { ref, type Ref } from "vue";
// import type { Car } from "./Car";

// const useCarsStore = defineStore("cars", () => {
//   const cars: Ref<{[key: string]: Car}> = ref({});
//   const carsLoading = ref(false);
//   const carsError: Ref<string | null> = ref(null);

//   async function fetchCars() {
//     carsLoading.value = true;
//     try {
//       const res = await fetch(`${import.meta.env.VITE_MOCK_API_URL}/api/cars`);
//       cars.value = await res.json();
//     } catch (err) {
//       carsError.value = `${err}`;
//     } finally {
//       carsLoading.value = false;
//     }
//   }

//   return {cars, carsLoading, carsError, fetchCars};
// });
