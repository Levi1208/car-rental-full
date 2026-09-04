import { mount } from "@vue/test-utils"
import { describe, expect, it } from "vitest"

import CarCard from "../CarCard.vue"

const carData = {
  "id": 1,
  "brand": "Honda",
  "model": "Civic",
  "passengers": 5,
  "daily_price_huf": 16250,
  "image": "https://media.ed.edmunds-media.com/honda/civic/2019/oem/2019_honda_civic_sedan_touring_fq_oem_1_815.jpg",
  "enabled": true
};

describe("CarCard", () => {
  it("renders", () => {
    const wrapper = mount(CarCard, {props: {car: carData}});
    const text = wrapper.text();
    expect(text).toContain("Honda Civic");
  });

  it("hides button slot container when nothing is slotted", () => {
    const wrapper = mount(CarCard, {props: {car: carData}});
    const container = wrapper.find("#btn-wrapper");

    expect(container.isVisible()).toBe(false);
  });

  it("slots buttons", () => {
    const wrapper = mount(CarCard, {
      props: {
        car: carData
      },
      slots: {
        "view-btn": "<a>Foglalás</a>",
        "admin-btn": "<a>Szerkesztés</a>"
      },
    });

    const [viewBtnSlotted, adminBtnSlotted] = wrapper.findAll("#btn-wrapper a");

    expect(viewBtnSlotted?.text()).toContain("Foglalás");
    expect(adminBtnSlotted?.text()).toContain("Szerkesztés")
  });

  it("button slot container and its contents are visible when something is slotted", () => {
    const wrapper = mount(CarCard, {
      props: {
        car: carData
      },
      slots: {
        "view-btn": "<a>Foglalás</a>"
      },
    });
    const container = wrapper.find("#btn-wrapper");
    const slotted = wrapper.find("#btn-wrapper a");

    expect(container.isVisible()).toBe(true);
    expect(slotted.isVisible()).toBe(true);
  });
});
