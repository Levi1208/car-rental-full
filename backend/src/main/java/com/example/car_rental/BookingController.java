package com.example.car_rental;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BookingController {
    private final CarRentalService carRentalService;

    @PostMapping("/bookings")
    public BookingResponse createBooking(@Valid @RequestBody BookingRequest request) {
        return BookingResponse.fromEntity(carRentalService.createBooking(request));
    }

    @GetMapping("/admin/bookings")
    public List<BookingResponse> getBookings() {
        return carRentalService.getAllBookings().stream()
            .map(BookingResponse::fromEntity)
            .toList();
    }
}
