import { useCarsQuery } from "@/queries/cars";
import { mount, type VueWrapper } from "@vue/test-utils";
import { beforeEach, expect } from "vitest";
import { describe, it, vi } from "vitest";
import { ref } from "vue";

import EditCarView from "../EditCarView.vue";
import { useEditCarMutation } from "@/mutations/editCar.ts";
import { useCreateCarMutation } from "@/mutations/createCar.ts";
import { setActivePinia } from "pinia";
import { createTestingPinia } from "@pinia/testing";
import { nextTick } from "vue";

vi.mock("@/queries/cars");
vi.mock("@/mutations/editCar");
vi.mock("@/mutations/createCar");

vi.mock("vue-router", () => ({
  useRoute: () => ({
    params: {
      id: "1"
    },
  }),
}));

describe("EditCarView", () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    setActivePinia(createTestingPinia({ createSpy: vi.fn, stubActions: true }));

    vi.mocked(useCarsQuery).mockReturnValue({
      cars: ref({}),
      carsLoading: ref(false),
      carsError: ref(null),
      refresh: () => {throw new Error("mocked")},
      asAdmin: ref(false)
    });

    vi.mocked(useEditCarMutation).mockReturnValue({
      selectedCarID: ref(1),
      mutateAsync: async () => new Promise(resolve => resolve(null)),
    });

    vi.mocked(useCreateCarMutation).mockReturnValue({
      mutateAsync: async () => new Promise(resolve => resolve(null)),
    });

    wrapper = mount(EditCarView);
  })

  it("renders", async () => {
    const carsQuery = useCarsQuery();

    carsQuery.cars.value = {
      "1": {
        "id": 1,
        "brand": "Honda",
        "model": "Civic",
        "passengers": 5,
        "daily_price_huf": 16250,
        "image": "https://media.ed.edmunds-media.com/honda/civic/2019/oem/2019_honda_civic_sedan_touring_fq_oem_1_815.jpg",
        "enabled": true
      }
    }

    await nextTick();

    expect(wrapper.text()).toContain("Honda");
  });
});
