package com.example.car_rental;

import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

@SpringBootTest
public class SecurityIntegrationTest {

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
    public void testPublicEndpoints() throws Exception {
        mockMvc.perform(get("/api/cars"))
            .andExpect(status().isOk());
    }

    @Test
    public void testLoginAndProtectedEndpoint() throws Exception {
        // 1. Try to access protected endpoint without token
        mockMvc.perform(get("/api/admin/bookings"))
            .andExpect(status().isForbidden());

        // 2. Login
        LoginRequest loginRequest = new LoginRequest("admin", "admin");
        MvcResult result = mockMvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isOk())
            .andReturn();

        String responseString = result.getResponse().getContentAsString();
        LoginResponse loginResponse = objectMapper.readValue(responseString, LoginResponse.class);
        String token = loginResponse.getToken();
        assertThat(token).isNotBlank();

        // 3. Access protected GET endpoint with token
        mockMvc.perform(get("/api/admin/bookings")
            .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk());

        // 4. Access protected POST endpoint with token
        CarCreateOrUpdateRequest carRequest = new CarCreateOrUpdateRequest("Tesla", "Model 3", 5, 10000, "image.jpg", true);
        mockMvc.perform(post("/api/admin/cars")
            .header("Authorization", "Bearer " + token)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(carRequest)))
            .andExpect(status().isOk());
    }

    @Test
    public void testLoginWithInvalidCredentials() throws Exception {
        LoginRequest loginRequest = new LoginRequest("admin", "wrongpassword");
        mockMvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isForbidden());
    }
}
