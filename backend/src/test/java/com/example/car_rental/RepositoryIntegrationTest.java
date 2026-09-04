package com.example.car_rental;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
//@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class RepositoryIntegrationTest {

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Test
    public void findAvailableCars_shouldExcludeOverlapping() {
        Car car1 = new Car(null, "UniqueTesla", "Model 3", 5, 10000, "img", true);
        Car car2 = new Car(null, "UniqueBMW", "i3", 4, 8000, "img", true);
        carRepository.save(car1);
        carRepository.save(car2);

        Booking booking = new Booking();
        booking.setCar(car1);
        booking.setStartDate(LocalDate.now().plusDays(2));
        booking.setEndDate(LocalDate.now().plusDays(5));
        bookingRepository.save(booking);

        // Search in range that overlaps with booking
        List<Car> available = carRepository.findAvailableCars(LocalDate.now().plusDays(4), LocalDate.now().plusDays(6));
        
        assertThat(available.stream().anyMatch(c -> c.getBrand().equals("UniqueBMW"))).isTrue();
        assertThat(available.stream().noneMatch(c -> c.getBrand().equals("UniqueTesla"))).isTrue();
    }

    @Test
    public void findAvailableCars_shouldExcludeDisabled() {
        Car car1 = new Car(null, "DisabledCar", "Model 3", 5, 10000, "img", false);
        carRepository.save(car1);

        List<Car> available = carRepository.findAvailableCars(LocalDate.now(), LocalDate.now().plusDays(1));
        
        assertThat(available.stream().noneMatch(c -> c.getBrand().equals("DisabledCar"))).isTrue();
    }

    @Test
    public void findOverlappingBookings_shouldDetectAllOverlaps() {
        Car car = new Car(null, "Tesla", "Model 3", 5, 10000, "img", true);
        carRepository.save(car);

        Booking existing = new Booking();
        existing.setCar(car);
        existing.setStartDate(LocalDate.now().plusDays(10));
        existing.setEndDate(LocalDate.now().plusDays(20));
        bookingRepository.save(existing);

        // 1. Fully within
        assertThat(bookingRepository.findOverlappingBookings(car.getId(), LocalDate.now().plusDays(12), LocalDate.now().plusDays(15))).isNotEmpty();
        // 2. Overlap start
        assertThat(bookingRepository.findOverlappingBookings(car.getId(), LocalDate.now().plusDays(5), LocalDate.now().plusDays(15))).isNotEmpty();
        // 3. Overlap end
        assertThat(bookingRepository.findOverlappingBookings(car.getId(), LocalDate.now().plusDays(15), LocalDate.now().plusDays(25))).isNotEmpty();
        // 4. Encompass
        assertThat(bookingRepository.findOverlappingBookings(car.getId(), LocalDate.now().plusDays(5), LocalDate.now().plusDays(25))).isNotEmpty();
        // 5. Exactly same
        assertThat(bookingRepository.findOverlappingBookings(car.getId(), LocalDate.now().plusDays(10), LocalDate.now().plusDays(20))).isNotEmpty();
        // 6. No overlap before
        assertThat(bookingRepository.findOverlappingBookings(car.getId(), LocalDate.now().plusDays(1), LocalDate.now().plusDays(9))).isEmpty();
        // 7. No overlap after
        assertThat(bookingRepository.findOverlappingBookings(car.getId(), LocalDate.now().plusDays(21), LocalDate.now().plusDays(30))).isEmpty();
    }
}
