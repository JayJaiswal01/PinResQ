package com.pinresq.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "volunteer_responses")
public class VolunteerResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "report_id", nullable = false)
    private Long reportId;

    @Column(name = "volunteer_id", nullable = false)
    private Long volunteerId;

    @Column(nullable = false)
    private String status; // ACCEPTED, REJECTED, EN_ROUTE

    @Column(name = "responded_at", nullable = false)
    private LocalDateTime respondedAt;

    @PrePersist
    public void prePersist() {
        this.respondedAt = LocalDateTime.now();
    }

    public VolunteerResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getReportId() { return reportId; }
    public void setReportId(Long reportId) { this.reportId = reportId; }

    public Long getVolunteerId() { return volunteerId; }
    public void setVolunteerId(Long volunteerId) { this.volunteerId = volunteerId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getRespondedAt() { return respondedAt; }
    public void setRespondedAt(LocalDateTime respondedAt) { this.respondedAt = respondedAt; }
}
