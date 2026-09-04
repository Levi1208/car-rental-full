import { defineMutation, useMutation } from "@pinia/colada";

export type BookingRequestDetails = {
  car_id: number,
  name: string,
  email: string,
  address: string,
  phone: string,
  start_date: string,
  end_date: string
};

export const useBookMutation = defineMutation(() => {
  const { mutateAsync } = useMutation({
    mutation: async (booking: BookingRequestDetails) => {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/api/bookings`,
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(booking)
        }
      );
      if (!response.ok) throw new Error("Booking failed.");
      return response.json();
    },
    onSuccess(data: {}) {

    }
  });

  return { mutateAsync };
})
