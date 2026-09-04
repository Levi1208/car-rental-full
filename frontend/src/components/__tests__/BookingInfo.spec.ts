import { useCarsQuery } from "@/queries/cars";
import { mount } from "@vue/test-utils";
import { beforeEach, vi } from "vitest";
import { describe, expect, it } from "vitest";
import { ref } from "vue";

import BookingInfo from "../BookingInfo.vue";

vi.mock("@/queries/cars");

describe("BookingInfo", () => {
  beforeEach(() => {
    vi.mocked(useCarsQuery).mockReturnValue({
      cars: ref({
        "1": {
          "id": 1,
          "brand": "Honda",
          "model": "Civic",
          "passengers": 5,
          "daily_price_huf": 16250,
          "image": "https://media.ed.edmunds-media.com/honda/civic/2019/oem/2019_honda_civic_sedan_touring_fq_oem_1_815.jpg",
          "enabled": true
        }
      }),
      carsLoading: ref(false),
      carsError: ref(null),
      refresh: () => {throw new Error("mocked")},
      asAdmin: ref(true)
    });
  })

  it("renders", () => {
    const wrapper = mount(BookingInfo, {props: {booking: {
      car_id: 1,
      start_date: "2026-08-02",
      end_date: "2026-08-03",
      name: "teszt név",
      email: "teszt email",
      address: "teszt cím",
      phone: "teszt telefonszám",
      total_price: 50000,
    }}});

    expect(wrapper.text()).toContain("Honda Civic");
    expect(wrapper.text()).toMatch(/2026[^\d]+08[^\d]+02/);
    expect(wrapper.text()).toMatch(/2026[^\d]+08[^\d]+03/);
    expect(wrapper.text()).toContain("teszt név");
    expect(wrapper.text()).toContain("teszt email");
    expect(wrapper.text()).toContain("teszt cím");
    expect(wrapper.text()).toContain("teszt telefonszám");
    expect(wrapper.text()).toContain((50000).toLocaleString("hu"));
  })
});
