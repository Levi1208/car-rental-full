package com.example.car_rental;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    @Query("SELECT b FROM Booking b WHERE b.car.id = :carId AND b.startDate <= :endDate AND b.endDate >= :startDate")
    List<Booking> findOverlappingBookings(@Param("carId") Long carId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // for bookings before the date
    //List<Booking> findByCarIdAndEndDateLessThan(Long carId, LocalDate date);

    // for bookings after the date
    List<Booking> findByCarIdAndStartDateGreaterThan(Long carId, LocalDate date);

    // if the dates are the same, for bookings including the date
    //List<Booking> findByCarIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(Long carId, LocalDate date1, LocalDate date2);
}
