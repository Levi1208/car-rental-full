import { defineMutation, useMutation, useQueryCache } from "@pinia/colada";
import type { CarCreateOrUpdateRequest } from "./CarCreateOrUpdateRequest";
import { useAuthStore } from "@/stores/auth";
import { ref } from "vue";

export const useEditCarMutation = defineMutation(() => {
  const authStore = useAuthStore();
  const selectedCarID = ref<number | null>(null);

  const queryCache = useQueryCache();

  const { mutateAsync, ...mutation } = useMutation({
    mutation: async (carData: CarCreateOrUpdateRequest) => {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/api/admin/cars/${selectedCarID.value}`,
        {
          method: "PUT",
          headers: {"Content-Type": "application/json", "Authorization": `Bearer ${authStore.token ?? ""}` },
          body: JSON.stringify(carData)
        }
      );
      if (!response.ok) throw new Error("Car creation failed.");
      return response.json();
    },
    onSuccess() {
      queryCache.invalidateQueries({ key: ["cars"] })
    }
  });

  return {
    //...mutation,
    mutateAsync,
    selectedCarID
  };
});
