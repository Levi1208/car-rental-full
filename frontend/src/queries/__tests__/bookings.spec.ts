import { PiniaColada } from "@pinia/colada";
import { mount } from "@vue/test-utils";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";


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

  it("reports loading correctly and fetches bookings", () => {
    const server = setupServer(
      http.get(`/api/bookings`, () => {
        return HttpResponse.json([]);
      })
    );

    server.listen();
    // TODO
    expect(1).toBe(1);
  })
})
