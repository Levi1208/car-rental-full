import type { BookingFull } from "./src/stores/Booking";
import type { Car } from "./src/stores/Car";
import express, { type Request } from "express";
import fs from "node:fs/promises"
import path from "node:path";

import { fakerHU as faker } from "@faker-js/faker";
import { differenceInCalendarDays } from "date-fns";

function dateRangesOverlap(fromA: string, toA: string, fromB: string, toB: string): boolean {
  return fromA <= toB && toA >= fromB;
}

const app = express();

app.use(express.json());

const MOCK_ADMIN_TOKEN = "mock-admin-token";


const cars = JSON.parse(await fs.readFile(path.join(import.meta.dirname, "mock_api", "cars.json"), "utf-8")) as {[key: string]: Car};

const bookings: BookingFull[] = [];

// some bookings for the same car might overlap
const count = faker.number.int({min: 10, max: 20});
for (let i = 0; i < count; ++i) {
  const [start_date, end_date] = faker.date.betweens({
    from: "2026-08-01",
    to: "2026-09-30",
    count: 2
  }).map(date => date.toISOString().split("T", 1)[0]) as [string, string];

  const carID = faker.number.int({
    min: Math.min(...Object.keys(cars).map(id => Number(id))),
    max: Math.max(...Object.keys(cars).map(id => Number(id)))
  });

  bookings.push({
    car_id: carID,
    start_date: start_date,
    end_date: end_date,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    address: faker.location.postalAddress(),
    phone: faker.phone.number(),
    total_price: cars[`${carID}`]!.daily_price_huf * (differenceInCalendarDays(end_date, start_date) + 1)
  });
}

function getNextCarID(): number {
  return Math.max(...Object.keys(cars).map(id => Number(id))) + 1;
}

app.get("/cars", async (_, response) => {
  response.status(200).json(cars);
});

// TODO !!
app.get("admin/bookings", async (request, response) => {
  response.status(200).json(bookings);
});

app.post("/bookings", async (request, response) => {

  response.status(200).json({});
});

app.post("admin/cars", async (request, response) => {
  if (request.headers.authorization === "Bearer " + MOCK_ADMIN_TOKEN) {
    const data = request.body;
    const id = getNextCarID();
    cars[`${id}`] = {
      id: id,
      brand: data.brand ?? "",
      model: data.model ?? "",
      passengers: data.passengers ?? 0,
      daily_price_huf: data.daily_price_huf ?? 0,
      image: data.image ?? "",
      enabled: data.enabled ?? false,
    };
    response.status(201).json();
  } else {
    response.status(401).json({ message: " "});
  }
});

app.put("admin/cars/:id", async (request: Request<{id: string}>, response) => {
  if (request.headers.authorization === "Bearer " + MOCK_ADMIN_TOKEN) {
    const data = request.body;
    const car = cars[request.params.id]!;
    cars[request.params.id] = {
      id: car.id,
      brand: data.brand ?? car.brand,
      model: data.model ?? car.model,
      passengers: data.passengers ?? car.passengers,
      daily_price_huf: data.daily_price_huf ?? car.daily_price_huf,
      image: data.image ?? car.image,
      enabled: data.enabled ?? car.enabled,
    };
    response.status(200).json();
  } else {
    response.status(401);
  }
});

app.post("/auth/login", async (request, response) => {
  const { username, password }: { username: string, password: string } = request.body;
  if (username === "admin" && password === "admin") {
    response.status(200).json({ token: MOCK_ADMIN_TOKEN });
  } else {
    response.status(401).json({ message: "" });
  }
});

export default app;
