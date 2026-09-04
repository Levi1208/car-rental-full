package com.example.car_rental;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    private @Id
    @GeneratedValue Long id;

    @ManyToOne //(optional = false)
    private Car car;

    private LocalDate startDate;
    private LocalDate endDate;

    private String name;
    private String email;
    private String address;
    private String phone;

    private Integer totalPrice;
}
