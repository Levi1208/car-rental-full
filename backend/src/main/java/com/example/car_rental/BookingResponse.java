package com.example.car_rental;

import java.time.LocalDate;

public record BookingResponse(
    Long id,
    Long car_id,
    LocalDate startDate,
    LocalDate endDate,
    String name,
    String email,
    String address,
    String phone,
    Integer totalPrice
) {
    public static BookingResponse fromEntity(Booking booking) {
        if (booking == null) return null;
        return new BookingResponse(
            booking.getId(),
            booking.getCar().getId(), //CarResponse.fromEntity(booking.getCar()),
            booking.getStartDate(),
            booking.getEndDate(),
            booking.getName(),
            booking.getEmail(),
            booking.getAddress(),
            booking.getPhone(),
            booking.getTotalPrice()
        );
    }
}
