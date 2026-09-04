package com.example.car_rental;

import net.datafaker.Faker;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Random;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CarRepository carRepository;
    private final BookingRepository bookingRepository;
    private final ObjectMapper objectMapper;

    @Override
    public void run(String... args) throws Exception {
        //if (true) return;
        if (carRepository.count() == 0) {
            try (InputStream inputStream = getClass().getResourceAsStream("/cars.json")) {
                List<Car> cars = objectMapper.readValue(inputStream, new TypeReference<List<Car>>() {});
                carRepository.saveAll(cars);
            }
            System.out.println("DB seeded with cars from JSON");
        }

        if (bookingRepository.count() == 0) {
            // TODO

            Faker faker = new Faker(Locale.of("hu"));

            int count = faker.number().numberBetween(12, 24);
            List<Long> carIds = carRepository.findAll().stream().map(Car::getId).toList();

            // bookings may overlap for a car, but it's just dummy data anyway

            Instant start = LocalDate.parse("2026-08-01").atStartOfDay().toInstant(ZoneOffset.UTC);
            Instant end = LocalDate.parse("2026-09-30").plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC);

            for (int i = 0; i <= count; ++i) {
                long carId = carIds.get(faker.number().numberBetween(0, carIds.size()));

                Instant instant1 = faker.timeAndDate().between(start, end);
                Instant instant2 = faker.timeAndDate().between(instant1, end);

                LocalDate day1 = instant1.atOffset(ZoneOffset.UTC).toLocalDate();
                LocalDate day2 = instant2.atOffset(ZoneOffset.UTC).toLocalDate();

                Car car = carRepository.findById(carId).orElseThrow();
                Booking booking = new Booking();
                booking.setCar(car);
                booking.setStartDate(day1);
                booking.setEndDate(day2);
                booking.setName(faker.name().name());
                booking.setEmail(faker.internet().emailAddress());
                booking.setAddress(faker.address().fullAddress());
                booking.setPhone(faker.phoneNumber().phoneNumber());
                booking.setTotalPrice(car.getDailyPriceHuf() * (int) (ChronoUnit.DAYS.between(day1, day2) + 1));

                bookingRepository.save(booking);
            }

            System.out.println("DB seeded with generated bookings");
        }
    }
}
