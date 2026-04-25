package com.pinresq.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    // ── Wizard step fields ───────────────────────────────────────────────────
    @Column(nullable = true)
    private String severity;          // "Minor" | "Moderate" | "Severe"

    @Column(name = "vehicles_involved", nullable = true)
    private Integer vehiclesInvolved;

    @Column(name = "fire_smoke_present", nullable = true)
    private Boolean fireSmokePresent;

    @Column(name = "has_video", nullable = true)
    private Boolean hasVideo;

    @Column(nullable = false)
    private String status;            // RECEIVED | VERIFYING | DISPATCHED | EN_ROUTE | RESOLVED

    // ── Phase 3B additions ────────────────────────────────────────────────────
    @Column(nullable = true)
    private String type;              // "ACCIDENT" | "FIRE" | "MEDICAL" | "FLOOD" | "OTHER"

    @Column(columnDefinition = "TEXT", nullable = true)
    private String description;

    @Column(nullable = true)
    private String priority;          // "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

    // ── Lifecycle ────────────────────────────────────────────────────────────
    @PrePersist
    public void prePersist() {
        this.timestamp = LocalDateTime.now();
        if (this.status == null)           this.status = "RECEIVED";
        if (this.hasVideo == null)         this.hasVideo = false;
        if (this.fireSmokePresent == null) this.fireSmokePresent = false;
        if (this.vehiclesInvolved == null) this.vehiclesInvolved = 1;
        if (this.severity == null)         this.severity = "Moderate";
        if (this.type == null)             this.type = "ACCIDENT";
        if (this.priority == null)         this.priority = "MEDIUM";
    }

    // ── Constructors ─────────────────────────────────────────────────────────
    public Report() {}

    // ── Getters & Setters ────────────────────────────────────────────────────
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public Integer getVehiclesInvolved() { return vehiclesInvolved; }
    public void setVehiclesInvolved(Integer vehiclesInvolved) { this.vehiclesInvolved = vehiclesInvolved; }

    public Boolean getFireSmokePresent() { return fireSmokePresent; }
    public void setFireSmokePresent(Boolean fireSmokePresent) { this.fireSmokePresent = fireSmokePresent; }

    public Boolean getHasVideo() { return hasVideo; }
    public void setHasVideo(Boolean hasVideo) { this.hasVideo = hasVideo; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
}
