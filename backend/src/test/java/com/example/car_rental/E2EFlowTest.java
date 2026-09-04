package com.example.car_rental;

import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
public class E2EFlowTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void fullUserAndAdminFlow() throws Exception {
        MockMvc mockMvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply(springSecurity())
            .build();

        // 1. User: List available cars
        LocalDate start = LocalDate.now().plusDays(30);
        LocalDate end = LocalDate.now().plusDays(35);
        
        MvcResult result = mockMvc.perform(get("/api/cars")
            .param("startDate", start.toString())
            .param("endDate", end.toString()))
            .andExpect(status().isOk())
            .andReturn();
        
        String content = result.getResponse().getContentAsString();
        List<CarResponse> cars = objectMapper.readValue(content, objectMapper.getTypeFactory().constructCollectionType(List.class, CarResponse.class));
        assertThat(cars).isNotEmpty();
        Long carId = cars.get(0).id();

        // 2. User: Book a car
        BookingRequest bookingRequest = new BookingRequest(carId, start, end, "John Doe", "john@doe.com", "Main St", "555-1234");
        mockMvc.perform(post("/api/bookings")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(bookingRequest)))
            .andExpect(status().isOk());

        // 3. User: List available cars again for same dates - should be gone
        result = mockMvc.perform(get("/api/cars")
            .param("startDate", start.toString())
            .param("endDate", end.toString()))
            .andExpect(status().isOk())
            .andReturn();
        
        content = result.getResponse().getContentAsString();
        List<CarResponse> carsAfter = objectMapper.readValue(content, objectMapper.getTypeFactory().constructCollectionType(List.class, CarResponse.class));
        assertThat(carsAfter.stream().noneMatch(c -> c.id().equals(carId))).isTrue();

        // 4. Admin: Login
        LoginRequest loginRequest = new LoginRequest("admin", "admin");
        result = mockMvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isOk())
            .andReturn();

        String token = objectMapper.readValue(result.getResponse().getContentAsString(), LoginResponse.class).getToken();

        // 5. Admin: Create new car
        CarCreateOrUpdateRequest newCar = new CarCreateOrUpdateRequest("Ferrari", "Enzo", 2, 500000, "ferrari.jpg", true);
        mockMvc.perform(post("/api/admin/cars")
            .header("Authorization", "Bearer " + token)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(newCar)))
            .andExpect(status().isOk());

        // 6. User: Verify new car appears
        result = mockMvc.perform(get("/api/cars"))
            .andExpect(status().isOk())
            .andReturn();
        
        content = result.getResponse().getContentAsString();
        assertThat(content).contains("Ferrari");
    }
}
