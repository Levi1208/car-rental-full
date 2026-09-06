package com.example.car_rental;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.time.Clock;

@SpringBootApplication
public class CarRentalApplication {

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**")
					.allowedOriginPatterns("http://localhost:[*]")
					.allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
					.allowedHeaders("*");
			}
		};
	}

	@Bean
	public Clock clock() {
		return Clock.systemDefaultZone();
	}

	public static void main(String[] args) {
		SpringApplication.run(CarRentalApplication.class, args);
	}

}
