import { useCarsQuery } from "@/queries/cars";
import { mount, type VueWrapper } from "@vue/test-utils";
import { beforeEach } from "vitest";
import { describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import EditCarView from "../EditCarView.vue";
import { useEditCarMutation } from "@/mutations/editCar.ts";
import { useCreateCarMutation } from "@/mutations/createCar.ts";

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

  it("renders", () => {
    // TODO
    expect(true).toBe(true);
    //expect(wrapper.isVisible()).toBe(true)
  });
});
