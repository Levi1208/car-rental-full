import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCarsQuery } from "../cars";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { createPinia, setActivePinia } from "pinia";
import { PiniaColada } from "@pinia/colada";
import { mount } from "@vue/test-utils";

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

vi.stubEnv("VITE_APP_API_URL", "");

describe("Cars Query", () => {
  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);

    mount({ setup: () => null }, {
      global: {
        plugins: [pinia, PiniaColada]
      }
    });

  });

  it("reports loading correctly and fetches cars", async () => {
    const server = setupServer(
      http.get(`/api/cars`, () => {
        return HttpResponse.json(mockCars);
      })
    );

    server.listen();

    const { cars, carsLoading, refresh } = useCarsQuery();

    expect(carsLoading.value).toBe(true);

    await refresh();

    expect(carsLoading.value).toBe(false);

    expect(cars.value[1].brand).toBe("Honda");
    expect(cars.value[2].model).toBe("Altima");
  });

  it("fetches from admin source if set to", async () => {
    const server = setupServer(
      http.get(`/api/admin/cars`, () => {
        return HttpResponse.json(mockCars);
      })
    );

    server.listen();

    const { cars, carsLoading, refresh, asAdmin } = useCarsQuery();

    asAdmin.value = true;

    await refresh();

    expect(cars.value[1].brand).toBe("Honda");
    expect(cars.value[2].model).toBe("Altima");
  });
});
