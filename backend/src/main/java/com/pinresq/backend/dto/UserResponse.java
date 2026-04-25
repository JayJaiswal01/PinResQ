package com.pinresq.backend.dto;

import java.time.LocalDateTime;

/** Safe user response – never includes the password field */
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Boolean volunteerMode;
    private String role;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;

    public UserResponse() {}

    public UserResponse(Long id, String name, String email, String phone,
                        Boolean volunteerMode, String role,
                        LocalDateTime createdAt, LocalDateTime lastLogin) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.volunteerMode = volunteerMode;
        this.role = role;
        this.createdAt = createdAt;
        this.lastLogin = lastLogin;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Boolean getVolunteerMode() { return volunteerMode; }
    public void setVolunteerMode(Boolean volunteerMode) { this.volunteerMode = volunteerMode; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }
}
