import { useAuthStore } from "@/stores/auth";
import type { BookingPublic } from "@/stores/Booking";
import { defineQuery, useQuery } from "@pinia/colada";
import { storeToRefs } from "pinia";

export const useBookingsQuery = defineQuery(() => {
  const authStore = useAuthStore();
  const { token } = storeToRefs(authStore);

  const { data: bookings, isLoading, error, ...rest } = useQuery({
    key: ["bookings"],
    query: async () => {
      const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/admin/bookings`, {
        headers: {"Authorization": `Bearer ${token.value}`}
      });
      if (!res.ok) throw new Error("Couldn't retrieve bookings.");
      const json = await res.json();
      return json as BookingPublic[];
    },
    //placeholderData: () => [],
  });

  return { bookings, bookingsLoading: isLoading, bookingsError: error };
});
