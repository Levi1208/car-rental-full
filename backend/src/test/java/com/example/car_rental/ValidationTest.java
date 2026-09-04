package com.example.car_rental;

import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

@SpringBootTest
public class ValidationTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply(springSecurity())
            .build();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void createCar_withInvalidData_shouldReturnBadRequest() throws Exception {
        CarCreateOrUpdateRequest request = new CarCreateOrUpdateRequest("", "", 0, 0, "", true);

        mockMvc.perform(
            post("/api/admin/cars")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
            )
            .andExpect(status().isBadRequest());
    }

    @Test
    public void login_withInvalidData_shouldReturnBadRequest() throws Exception {
        LoginRequest request = LoginRequest.builder().username("").password("").build();

        mockMvc.perform(
            post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
            )
            .andExpect(status().isBadRequest());
    }

    @Test
    public void createBooking_withInvalidData_shouldReturnBadRequest() throws Exception {
        BookingRequest request = new BookingRequest(
            0, // invalid carId
            LocalDate.now().minusDays(1), // past date
            LocalDate.now().minusDays(2), // past date
            "", // empty name
            "invalid-email", // invalid email
            "", // empty address
            "" // empty phone
        );

        mockMvc.perform(
            post("/api/bookings")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
            )
            .andExpect(status().isBadRequest());
    }

    @Test
    public void createBooking_withInvalidDateRange_shouldReturnBadRequest() throws Exception {
        BookingRequest request = new BookingRequest(
            1,
            LocalDate.now().plusDays(2),
            LocalDate.now().plusDays(1), // endDate before startDate
            "John Doe",
            "john@example.com",
            "123 Street",
            "123456789"
        );

        mockMvc.perform(
            post("/api/bookings")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
            )
            .andExpect(status().isBadRequest());
    }
}
