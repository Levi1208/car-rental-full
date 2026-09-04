import { useAuthStore } from "@/stores/auth";
import type { Car } from "@/stores/Car";
import { useSearchStore } from "@/stores/search";
import { defineQuery, useQuery } from "@pinia/colada";
import { storeToRefs } from "pinia";
import { ref } from "vue";

export const useCarsQuery = defineQuery(() => {
  const searchStore = useSearchStore();
  const { fromDate, toDate } = storeToRefs(searchStore);

  const authStore = useAuthStore();
  const { token } = storeToRefs(authStore);

  const asAdmin = ref(false);

  const { data: cars, isLoading, error, refresh} = useQuery({
    key: () => ["cars", asAdmin.value, fromDate.value, toDate.value],
    query: async () => {
      const params = asAdmin.value ? "" : `?startDate=${fromDate.value}&endDate=${toDate.value}`;
      //const params = `?startDate=${fromDate.value}&endDate=${toDate.value}`;
      const res = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/api${asAdmin.value ? '/admin' : ''}/cars${params}`,
        {headers: {"Authorization": `Bearer ${token.value}`}}
      );
      if (!res.ok) throw new Error("Couldn't fetch cars.");
      const json = await res.json();

      if (Array.isArray(json)) {
        return Object.fromEntries(json.map(car => [car.id, car]));
      }

      return json as {[key: string]: Car};
    },
    //placeholderData: () => ({}),
  });

  return { cars, carsLoading: isLoading, carsError: error, asAdmin, refresh };
});
