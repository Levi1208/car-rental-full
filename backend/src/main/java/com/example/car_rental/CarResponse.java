package com.example.car_rental;

public record CarResponse(
    Long id,
    String brand,
    String model,
    Integer passengers,
    Integer dailyPriceHuf,
    String image,
    Boolean enabled
) {
    public static CarResponse fromEntity(Car car) {
        if (car == null) return null;
        return new CarResponse(
            car.getId(),
            car.getBrand(),
            car.getModel(),
            car.getPassengers(),
            car.getDailyPriceHuf(),
            car.getImage(),
            car.getEnabled()
        );
    }
}
