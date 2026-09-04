import { describe, expect, it, vi } from "vitest";

import AdminView from "../AdminView.vue";
import { useCarsQuery } from "@/queries/cars.ts";
import { nextTick, ref, type Ref } from "vue";
import { beforeEach } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { setActivePinia, type Pinia } from "pinia";
import { createTestingPinia } from "@pinia/testing";
import { useBookingsQuery } from "@/queries/bookings";
import { type BookingFull } from "@/stores/Booking";
import { afterEach } from "vitest";

vi.mock("@/queries/cars");
vi.mock("@/queries/bookings");

const mockCars = {
  "1": {
    "id": 1,
    "brand": "Honda",
    "model": "Civic",
    "passengers": 5,
    "daily_price_huf": 16250,
    "image": "https://media.ed.edmunds-media.com/honda/civic/2019/oem/2019_honda_civic_sedan_touring_fq_oem_1_815.jpg",
    "enabled": true
  }
};

describe("AdminView", () => {
  let wrapper: VueWrapper;
  let pinia: Pinia;

  beforeEach(() => {
    vi.useFakeTimers();

    pinia = createTestingPinia({ createSpy: vi.fn, stubActions: true });
    setActivePinia(pinia);

    vi.mocked(useCarsQuery).mockReturnValue({
      cars: ref({}),
      carsLoading: ref(false),
      carsError: ref(null),
      refresh: () => {throw new Error("mocked")},
      asAdmin: ref(true),
    });

    vi.mocked(useBookingsQuery).mockReturnValue({
      bookings: ref([]),
      bookingsLoading: ref(false),
      bookingsError: ref(null),
    });

    wrapper = mount(AdminView, {
      global: {
        plugins: [pinia],
        stubs: {
          RouterLink: true
        }
      }
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("indicates loading for cars and bookings", async () => {
    const carsQuery = useCarsQuery();
    const BookingsQuery = useBookingsQuery();

    carsQuery.carsLoading.value = true;
    BookingsQuery.bookingsLoading.value = true;

    await nextTick();

    expect(wrapper.text().toLowerCase()).toContain("autók betöltése");
    expect(wrapper.text().toLowerCase()).toContain("foglalások betöltése");
  });

  it("lists cars", async () => {
    const mockCars = {
      "1": {
        "id": 1,
        "brand": "Honda",
        "model": "Civic",
        "passengers": 5,
        "daily_price_huf": 16250,
        "image": "https://media.ed.edmunds-media.com/honda/civic/2019/oem/2019_honda_civic_sedan_touring_fq_oem_1_815.jpg",
        "enabled": true
      },
      "2": {
        "id": 2,
        "brand": "Nissan",
        "model": "Altima",
        "passengers": 5,
        "daily_price_huf": 14400,
        "image": "https://media.ed.edmunds-media.com/nissan/altima/2016/oem/2016_nissan_altima_sedan_25-sr_fq_oem_1_815.jpg",
        "enabled": true
      },
    };

    const carsQuery = useCarsQuery();
    carsQuery.cars.value = mockCars;

    await nextTick();

    const carElements = wrapper.findAll("#cars li");

    expect(carElements.length).toBe(2 + 1); // +1 because the add car button is also inside a <li>
  });

  it("lists bookings", async () => {
    const bookingsStore = useBookingsQuery() as ReturnType<typeof useBookingsQuery> & { bookings: Ref<BookingFull[]> };
    bookingsStore.bookings.value = [{
      car_id: 1,
      start_date: "2026-08-02",
      end_date: "2026-08-03",
      name: "teszt név",
      email: "teszt email",
      address: "teszt cím",
      phone: "teszt telefonszám",
      total_price: 50000,
    }];

    await nextTick();

    const bookings = wrapper.findAll("#bookings li");

    expect(bookings.length).toBe(1);
    expect(bookings[0]?.text()).toContain("teszt név");
  });
});
