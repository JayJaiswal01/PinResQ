package com.pinresq.backend.service;

import com.pinresq.backend.dto.LoginRequest;
import com.pinresq.backend.dto.RegisterRequest;
import com.pinresq.backend.dto.UserResponse;
import com.pinresq.backend.model.User;
import com.pinresq.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /** Register a new user: validates uniqueness, hashes password, saves to DB */
    public UserResponse registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setVolunteerMode(false);
        user.setRole("USER");

        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    /** Login: find user by email, compare BCrypt-hashed password, update lastLogin */
    public UserResponse loginUser(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid credentials");
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // ── Phase 4A: Track last login ──────────────────────────────────────
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        return toResponse(user);
    }

    /** Toggle volunteer mode ON/OFF for a given user */
    public UserResponse toggleVolunteerMode(Long userId) {
        Long id = Objects.requireNonNull(userId, "User ID must not be null");
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setVolunteerMode(!user.getVolunteerMode());
        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    /** Get user profile by ID */
    public UserResponse getUserById(Long userId) {
        Long id = Objects.requireNonNull(userId, "User ID must not be null");
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toResponse(user);
    }

    /** Convert User entity → UserResponse DTO (no password) */
    public UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getVolunteerMode(),
                user.getRole(),
                user.getCreatedAt(),
                user.getLastLogin()
        );
    }
}
