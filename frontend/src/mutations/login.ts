import { useAuthStore } from "@/stores/auth";
import { defineMutation, useMutation, useQueryCache } from "@pinia/colada";

export const useLoginMutation = defineMutation(() => {
  const authStore = useAuthStore();
  const queryCache = useQueryCache();

  const { mutateAsync } = useMutation({
    mutation: async (login: {username: string, password: string}) => {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(login)
        }
      );
      if (!response.ok) throw new Error("Login failed.");
      return response.json();
    },
    onSuccess(data: {token: string}) {
      authStore.setToken(data.token);
      queryCache.invalidateQueries({ key: ["bookings"] });
    }
  });

  return { mutateAsync };
});
