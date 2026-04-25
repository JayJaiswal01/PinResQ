package com.pinresq.backend.controller;

import com.pinresq.backend.dto.UserResponse;
import com.pinresq.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"})
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /** GET /api/users/{id} – fetch user profile */
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long id) {
        try {
            UserResponse user = userService.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /** PUT /api/users/{id}/volunteer – toggle volunteer mode */
    @PutMapping("/{id}/volunteer")
    public ResponseEntity<?> toggleVolunteer(@PathVariable Long id) {
        try {
            UserResponse user = userService.toggleVolunteerMode(id);
            return ResponseEntity.ok(Map.of(
                    "message", "Volunteer mode updated",
                    "user", user
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
