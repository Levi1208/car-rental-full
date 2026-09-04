import { PiniaColada } from "@pinia/colada";
import { mount } from "@vue/test-utils";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useBookingsQuery } from "../bookings";
import type { BookingFull } from "@/stores/Booking";
import type { Ref } from "vue";


vi.stubEnv("VITE_APP_API_URL", "");

describe("Bookings Query", () => {
  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);

    mount({ setup: () => null }, {
      global: {
        plugins: [pinia, PiniaColada]
      }
    });

  });

  it("reports loading correctly and fetches bookings", async () => {
    const server = setupServer(
      http.get(`/api/admin/bookings`, () => {
        return HttpResponse.json([
          {
            car_id: 1,
            start_date: "2026-08-02",
            end_date: "2026-08-03",
            name: "teszt név",
            email: "teszt email",
            address: "teszt cím",
            phone: "teszt telefonszám",
            total_price: 50000,
          }
        ]);
      })
    );

    server.listen();

    const { bookings, bookingsLoading, refresh} = useBookingsQuery() as ReturnType<typeof useBookingsQuery> & {
      bookings: Ref<BookingFull[]>
    };

    expect(bookingsLoading.value).toBe(true);

    await refresh();

    expect(bookings.value[0]?.name).toBe("teszt név");
  });
});
