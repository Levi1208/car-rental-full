import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest"

import DaterangeInput from "../DaterangeInput.vue";

describe("DaterangeInput", () => {
  it("fromDate and toDate are updated", async () => {
    const wrapper = mount(DaterangeInput, {
      props: {
        fromDate: "2026-08-19",
        "onUpdate:fromDate": e => wrapper.setProps({fromDate: e}),
        toDate: "2026-08-20",
        "onUpdate:toDate": e => wrapper.setProps({toDate: e}),
      }
    });
    const [fromDateInput, toDateInput] = wrapper.findAll("input");
    await fromDateInput!.setValue("2026-08-21");
    await toDateInput!.setValue("2026-08-22");

    expect(wrapper.props("fromDate")).toBe("2026-08-21");
    expect(wrapper.props("toDate")).toBe("2026-08-22");
  });
});
