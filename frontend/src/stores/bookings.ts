// import { defineStore } from "pinia";
// import { ref, type Ref } from "vue";
// import type { BookingPublic } from "./Booking";

// const useBookingsStore = defineStore("bookings", () => {
//   const bookings: Ref<BookingPublic[]> = ref([]);
//   const bookingsLoading = ref(false);
//   const bookingsError: Ref<string | null> = ref(null);

//   async function fetchBookings() {
//     bookingsLoading.value = true;
//     try {
//       const res = await fetch(`${import.meta.env.VITE_MOCK_API_URL}/api/admin/bookings`);
//       bookings.value = await res.json();
//     } catch (err) {
//       bookingsError.value = `${err}`;
//     } finally {
//       bookingsLoading.value = false;
//     }
//   }

//   return {bookings, bookingsLoading, bookingsError, fetchBookings: fetchBookings};
// });
