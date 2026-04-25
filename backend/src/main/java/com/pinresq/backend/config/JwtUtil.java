package com.pinresq.backend.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    // 256-bit key for HS256
    private static final String SECRET = "PinResQSuperSecretKey2024PinResQSuperSecretKey2024";
    private static final long EXPIRATION_MS = 86_400_000L; // 24 hours

    private final SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes());

    /** Generate a signed JWT token for the given email */
    public String generateToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(key)
                .compact();
    }

    /** Extract the email (subject) from the token */
    public String extractEmail(String token) {
        return parseClaims(token).getSubject();
    }

    /** Validate token — returns true if valid and not expired */
    public boolean isTokenValid(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
