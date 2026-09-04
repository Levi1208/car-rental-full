import { describe, expect, it, vi } from "vitest";

import PublicView from "../PublicView.vue";
import { mount, VueWrapper } from "@vue/test-utils";
import { nextTick, ref } from "vue";
import { useCarsQuery } from "@/queries/cars";
import { useBookingsQuery } from "@/queries/bookings.ts";
import { beforeEach } from "vitest";
import { setActivePinia, type Pinia } from "pinia";
import { createTestingPinia } from "@pinia/testing";
import { useSearchStore } from "@/stores/search.ts";

vi.mock("@/queries/cars");
//vi.mock("@/queries/bookings");

describe("PublicView", () => {
  let pinia: Pinia;
  let wrapper: VueWrapper;
  beforeEach(() => {
    pinia = createTestingPinia({ createSpy: vi.fn, stubActions: true });
    setActivePinia(pinia);
    const searchStore = useSearchStore();
    searchStore.refreshCurrentDateString = () => "2026-08-01";
    searchStore.currentDateString = "2026-08-01";

    vi.mocked(useCarsQuery).mockReturnValue({
      cars: ref({}),
      carsLoading: ref(false),
      carsError: ref(null),
      refresh: () => {throw new Error("mocked")},
      asAdmin: ref(false),
    });

    /* vi.mocked(useBookingsQuery).mockReturnValue({
      bookings: ref([]),
      bookingsLoading: ref(false),
      bookingsError: ref(null),
    }); */

    wrapper = mount(PublicView, {
      global: {
        plugins: [pinia],
        stubs: {
          RouterLink: true
        }
      }
    });
  });

  it("indicates loading", async () => {
    const carsQuery = useCarsQuery();
    carsQuery.carsLoading.value = true;

    await nextTick();

    expect(wrapper.text()).toContain("betöltés");
  });

  it("shows loading error", async () => {
    const carsQuery = useCarsQuery();
    carsQuery.carsError.value = new Error("hiba");

    await nextTick();

    expect(wrapper.text()).toContain("sikertelen");
  });

  it("says when there are no cars to show", async () => {
    // mock status change behavior
    const carsQuery = useCarsQuery();
    carsQuery.carsLoading.value = false;

    await nextTick();

    expect(wrapper.text()).toContain("Nincsenek foglalható autók");
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

    expect(carElements.length).toBe(2);
    expect(carElements.every(c => c.isVisible())).toBe(true);
  });

  // eslint-disable-next-line vitest/no-commented-out-tests
  /* it("doesn't show a car when it's unavailable", async () => {
    const carsStore = useCarsQuery();
    const bookingsStore = useBookingsQuery();
    const searchStore = useSearchStore();

    carsStore.cars.value = {
      "1": {
        "id": 1,
        "brand": "Honda",
        "model": "Civic",
        "passengers": 5,
        "daily_price_huf": 16250,
        "image": "https://media.ed.edmunds-media.com/honda/civic/2019/oem/2019_honda_civic_sedan_touring_fq_oem_1_815.jpg"
      }
    };

    bookingsStore.bookings.value = [{car: 1, start_date: "2026-08-02", end_date: "2026-08-03"}];

    searchStore.fromDate = "2026-08-01";
    searchStore.toDate = "2026-08-04";

    await nextTick();

    const carElement = wrapper.find<HTMLLIElement>("#cars li");

    expect(carElement.isVisible()).toBe(false);
  }); */

  it("shows search errors", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-01"));

    const searchStore = useSearchStore();

    searchStore.fromDate = "2026-07-31";
    searchStore.toDate = "2026-07-30";

    await nextTick();

    const errors = wrapper.findAll(".alert-danger");

    expect(errors.length).toBe(2);

    vi.useRealTimers();
  });
});
