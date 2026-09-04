package com.example.car_rental;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record CarCreateOrUpdateRequest(
    @NotBlank String brand,
    @NotBlank String model,
    @Min(1) int passengers,
    @Min(0) int dailyPriceHuf,
    String image,
    boolean enabled
) {}
