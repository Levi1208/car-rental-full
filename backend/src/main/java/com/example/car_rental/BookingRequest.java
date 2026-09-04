package com.example.car_rental;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record BookingRequest(
    @Min(1) long carId,
    @NotNull @FutureOrPresent LocalDate startDate,
    @NotNull @FutureOrPresent LocalDate endDate,
    @NotBlank String name,
    @NotBlank @Email String email,
    @NotBlank String address,
    @NotBlank String phone
) {
    @AssertTrue(message = "End date must be the same as or be after start date")
    public boolean isEndDateAfterStartDate() {
        if (startDate == null || endDate == null) {
            return true;
        }
        return endDate.isAfter(startDate) || endDate.isEqual(startDate);
    }
}
