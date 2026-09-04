package com.example.car_rental;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CarRentalServiceTest {

    @Mock
    private CarRepository carRepository;

    @Mock
    private BookingRepository bookingRepository;

    //@Mock
    @Spy
    private Clock clock = Clock.fixed(Instant.parse("2026-08-01T00:00:00Z"), ZoneOffset.UTC);

    @InjectMocks
    private CarRentalService carRentalService;

    @Test
    public void getAvailableCars_withDates_shouldCallRepository() {
        LocalDate start = LocalDate.now();
        LocalDate end = LocalDate.now().plusDays(1);
        when(carRepository.findAvailableCars(start, end)).thenReturn(Collections.emptyList());

        List<Car> result = carRentalService.getAvailableCars(start, end);

        assertThat(result).isEmpty();
        verify(carRepository).findAvailableCars(start, end);
    }

    @Test
    public void getAvailableCars_withoutDates_shouldReturnAllEnabled() {
        when(carRepository.findAllByEnabledTrue()).thenReturn(Collections.emptyList());

        List<Car> result = carRentalService.getAvailableCars(null, null);

        assertThat(result).isEmpty();
        verify(carRepository).findAllByEnabledTrue();
    }

    @Test
    public void createBooking_shouldCalculatePriceAndSave() {
        Car car = new Car(1L, "Tesla", "Model 3", 5, 10000, "image.jpg", true);
        BookingRequest request = new BookingRequest(1L, LocalDate.now(), LocalDate.now().plusDays(2), "John", "john@email.com", "Address", "1234");
        
        when(carRepository.findById(1L)).thenReturn(Optional.of(car));
        when(bookingRepository.findOverlappingBookings(any(), any(), any())).thenReturn(Collections.emptyList());
        when(bookingRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        Booking result = carRentalService.createBooking(request);

        assertThat(result.getTotalPrice()).isEqualTo(30000); // 3 days * 10000
        assertThat(result.getCar()).isEqualTo(car);
        verify(bookingRepository).save(any(Booking.class));
    }

    @Test
    public void createBooking_whenOverlapping_shouldThrowException() {
        Car car = new Car(1L, "Tesla", "Model 3", 5, 10000, "image.jpg", true);
        BookingRequest request = new BookingRequest(1L, LocalDate.now(), LocalDate.now().plusDays(2), "John", "john@email.com", "Address", "1234");

        when(carRepository.findById(1L)).thenReturn(Optional.of(car));
        when(bookingRepository.findOverlappingBookings(any(), any(), any())).thenReturn(List.of(new Booking()));

        assertThatThrownBy(() -> carRentalService.createBooking(request))
            .isInstanceOf(RuntimeException.class)
            .hasMessage("Car is not available for the selected date range");
    }

    @Test
    public void createCar_shouldSaveCar() {
        CarCreateOrUpdateRequest request = new CarCreateOrUpdateRequest("Audi", "A4", 5, 15000, "audi.jpg", false);
        when(carRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        Car result = carRentalService.createCar(request);

        assertThat(result.getBrand()).isEqualTo("Audi");
        assertThat(result.getModel()).isEqualTo("A4");
        assertThat(result.getEnabled()).isFalse();
        verify(carRepository).save(any(Car.class));
    }

    @Test
    public void updateCar_shouldUpdateAndSave() {
        Car existingCar = new Car(1L, "Old", "Old", 2, 5000, "old.jpg", true);
        CarCreateOrUpdateRequest request = new CarCreateOrUpdateRequest("New", "New", 4, 10000, "new.jpg", false);
        
        when(carRepository.findById(1L)).thenReturn(Optional.of(existingCar));
        when(carRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        Car result = carRentalService.updateCar(1L, request);

        assertThat(result.getBrand()).isEqualTo("New");
        assertThat(result.getDailyPriceHuf()).isEqualTo(10000);
        assertThat(result.getEnabled()).isFalse();
        verify(carRepository).save(any(Car.class));
    }

    @Test
    public void updateCarStatus_shouldDeleteFutureBookings() {
        Car car = new Car(1L, "Tesla", "Model 3", 5, 10000, "image.jpg", true);

        when(carRepository.findById(1L)).thenReturn(Optional.of(car));

        Booking booking = new Booking(
            1L,
            car,
            LocalDate.parse("2026-08-02"),
            LocalDate.parse(("2026-08-03")),
            "name",
            "a@a.com",
            "address",
            "123456789",
            10000
        );

        CarStatusChangeRequest request = new CarStatusChangeRequest(false);

        when(bookingRepository.findByCarIdAndStartDateGreaterThan(1L, LocalDate.now(clock))).thenReturn(List.of(booking));

        carRentalService.updateCarStatus(1L, request);

        verify(bookingRepository).findByCarIdAndStartDateGreaterThan(1L, LocalDate.now(clock));
        verify(bookingRepository).deleteAll(any());
    }
}
