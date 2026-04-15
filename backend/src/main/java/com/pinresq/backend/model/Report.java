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

    // ── New fields from 4-step wizard ───────────────────────────────────────
    @Column(nullable = true)
    private String severity;          // "Minor" | "Moderate" | "Severe"

    @Column(name = "vehicles_involved", nullable = true)
    private Integer vehiclesInvolved; // numeric count

    @Column(name = "fire_smoke_present", nullable = true)
    private Boolean fireSmokePresent; // true / false

    @Column(name = "has_video", nullable = true)
    private Boolean hasVideo;         // true if user attached video

    @Column(nullable = false)
    private String status;            // RECEIVED | VERIFYING | DISPATCHED | EN_ROUTE

    // ── Lifecycle ────────────────────────────────────────────────────────────
    @PrePersist
    public void prePersist() {
        this.timestamp = LocalDateTime.now();
        if (this.status == null) this.status = "RECEIVED";
        if (this.hasVideo == null) this.hasVideo = false;
        if (this.fireSmokePresent == null) this.fireSmokePresent = false;
        if (this.vehiclesInvolved == null) this.vehiclesInvolved = 1;
        if (this.severity == null) this.severity = "Moderate";
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
}
