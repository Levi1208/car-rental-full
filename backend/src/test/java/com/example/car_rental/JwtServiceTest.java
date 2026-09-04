package com.example.car_rental;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;

public class JwtServiceTest {

    private JwtService jwtService;

    private final String SECRET = "really_long_test_secret_key_for_testing_jwt";

    @BeforeEach
    public void setup() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", SECRET);
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", 3600000L); // 1 hour
    }

    @Test
    public void generateToken_shouldCreateValidToken() {
        UserDetails userDetails = new User("admin", "password", Collections.emptyList());
        String token = jwtService.generateToken(userDetails);

        assertThat(token).isNotBlank();
        assertThat(jwtService.extractUsername(token)).isEqualTo("admin");
    }

    @Test
    public void isTokenValid_shouldReturnTrueForCorrectUser() {
        UserDetails userDetails = new User("admin", "password", Collections.emptyList());
        String token = jwtService.generateToken(userDetails);

        assertThat(jwtService.isTokenValid(token, userDetails)).isTrue();
    }

    @Test
    public void isTokenValid_shouldReturnFalseForDifferentUser() {
        UserDetails userDetails = new User("admin", "password", Collections.emptyList());
        UserDetails otherUser = new User("user", "password", Collections.emptyList());
        String token = jwtService.generateToken(userDetails);

        assertThat(jwtService.isTokenValid(token, otherUser)).isFalse();
    }
}
