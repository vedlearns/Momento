package com.momento.common.security;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {
    private static final String SECRET = "test-signing-secret-with-at-least-32-bytes-long";

    @Test
    void generatedTokenHasSubjectAndValidSignature() {
        JwtService jwtService = new JwtService(SECRET, 60_000);
        String token = jwtService.generateToken("person@example.com");

        assertEquals("person@example.com", jwtService.extractUsername(token));
        assertTrue(jwtService.isTokenValid(token, "person@example.com"));
        assertFalse(jwtService.isTokenValid(token, "other@example.com"));
    }

    @Test
    void tokenSignedWithDifferentKeyIsRejected() {
        JwtService issuer = new JwtService(SECRET, 60_000);
        JwtService verifier = new JwtService(SECRET + "-different", 60_000);
        String token = issuer.generateToken("person@example.com");

        assertFalse(verifier.isTokenValid(token, "person@example.com"));
    }
}