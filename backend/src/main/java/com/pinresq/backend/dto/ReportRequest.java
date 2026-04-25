package com.pinresq.backend.dto;

import jakarta.validation.constraints.NotNull;

public class ReportRequest {

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    @NotNull(message = "User ID is required")
    private Long userId;

    // ── Wizard step fields (optional on create, have backend defaults) ───────
    private String severity;         // "Minor" | "Moderate" | "Severe"
    private Integer vehiclesInvolved;
    private Boolean fireSmokePresent;
    private Boolean hasVideo;

    // ── Phase 3B additions ────────────────────────────────────────────────────
    private String type;             // "ACCIDENT" | "FIRE" | "MEDICAL" | "FLOOD" | "OTHER"
    private String description;
    private String priority;         // "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

    // ── Getters & Setters ────────────────────────────────────────────────────
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

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

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
}
