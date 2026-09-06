package com.example.car_rental;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CarController {
    private final CarRentalService carRentalService;

    @GetMapping("/cars")
    public List<CarResponse> getCars(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return carRentalService.getAvailableCars(startDate, endDate).stream()
            .map(CarResponse::fromEntity)
            .toList();
    }

    @GetMapping("/admin/cars")
    public List<CarResponse> getAllCars() {
        return carRentalService.getAllCars().stream()
            .map(CarResponse::fromEntity)
            .toList();
    }

//    @GetMapping("/admin/cars/{id}")
//    public CarResponse getCar(@PathVariable Long id) {
//        return CarResponse.fromEntity(carRentalService.getCarById(id));
//    }

    @PostMapping("/admin/cars")
    public CarResponse createCar(@Valid @RequestBody CarCreateOrUpdateRequest request) {
        return CarResponse.fromEntity(carRentalService.createCar(request));
    }
    
    @PutMapping("/admin/cars/{id}")
    public CarResponse updateCar(@PathVariable Long id, @Valid @RequestBody CarCreateOrUpdateRequest request) {
        return CarResponse.fromEntity(carRentalService.updateCar(id, request));
    }

    @PutMapping("/admin/cars/{id}/status")
    public CarResponse setCarStatus(@PathVariable Long id, @Valid @RequestBody CarStatusChangeRequest request) {
        return CarResponse.fromEntity(carRentalService.updateCarStatus(id, request));
    }
}
