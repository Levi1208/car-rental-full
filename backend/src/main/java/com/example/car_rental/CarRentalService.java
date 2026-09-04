package com.example.car_rental;

import lombok.RequiredArgsConstructor;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class CarRentalService {
    private final CarRepository carRepository;
    private final BookingRepository bookingRepository;
    private final Clock clock;

    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    public List<Car> getAllEnabledCars()  {
        return carRepository.findAllByEnabledTrue();
    }

    public List<Car> getAvailableCars(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            return getAllEnabledCars();
        }
        return carRepository.findAvailableCars(startDate, endDate);
    }

    public Car getCarById(Long id) {
        return carRepository.findById(id).orElseThrow(() -> new RuntimeException("Car with specified ID not found"));
    }

    @Transactional
    public Car createCar(CarCreateOrUpdateRequest request) {
        Car car = new Car();
        car.setBrand(request.brand());
        car.setModel(request.model());
        car.setPassengers(request.passengers());
        car.setDailyPriceHuf(request.dailyPriceHuf());
        car.setImage(request.image());
        car.setEnabled(request.enabled());
        return carRepository.save(car);
    }

    @Transactional
    public Booking createBooking(BookingRequest request) {
        Car car = getCarById(request.carId());

        List<Booking> overlapping = bookingRepository.findOverlappingBookings(
            request.carId(),
            request.startDate(),
            request.endDate()
        );

        if (!overlapping.isEmpty()) {
            throw new RuntimeException("Car is not available for the selected date range");
        }

        Booking booking = new Booking();
        booking.setCar(car);
        booking.setStartDate(request.startDate());
        booking.setEndDate(request.endDate());
        booking.setName(request.name());
        booking.setEmail(request.email());
        booking.setAddress(request.address());
        booking.setPhone(request.phone());

        long days = ChronoUnit.DAYS.between(request.startDate(), request.endDate()) + 1;
        booking.setTotalPrice((int) (days * car.getDailyPriceHuf()));

        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    /*public List<Booking> getBookingsByCarIdIncludingAndAfterDate(Long carId, LocalDate date) {
        return Stream.concat(
            bookingRepository.findByCarIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                carId,
                date,
                date
            ).stream(),
            bookingRepository.findByCarIdAndStartDateGreaterThan(carId, date).stream()
        ).toList();
    }*/

    public List<Booking> getBookingsByCarIdAfterDate(Long carId, LocalDate date) {
        return bookingRepository.findByCarIdAndStartDateGreaterThan(carId, date);
    }

    @Transactional
    public Car updateCar(Long id, CarCreateOrUpdateRequest request) {
        LocalDate now = LocalDate.now(clock);

        Car car = getCarById(id);
        car.setBrand(request.brand());
        car.setModel(request.model());
        car.setPassengers(request.passengers());
        car.setDailyPriceHuf(request.dailyPriceHuf());
        car.setImage(request.image());
        car.setEnabled(request.enabled());

        if (!request.enabled()) {
            bookingRepository.deleteAll(getBookingsByCarIdAfterDate(id, now));
        }

        return carRepository.save(car);
    }

    @Transactional
    public Car updateCarStatus(Long id, CarStatusChangeRequest request) {
        LocalDate now = LocalDate.now(clock);

        Car car = getCarById(id);
        car.setEnabled(request.enabled());

        if (!request.enabled()) {
            bookingRepository.deleteAll(getBookingsByCarIdAfterDate(id, now));
        }

        return carRepository.save(car);
    }
}
