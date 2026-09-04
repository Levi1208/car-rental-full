package com.example.car_rental;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cars")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Car {
    private @Id
    @GeneratedValue Long id;

    private String brand;
    private String model;
    private Integer passengers;

    private Integer dailyPriceHuf;

    private String image;

    private Boolean enabled = true;
}
