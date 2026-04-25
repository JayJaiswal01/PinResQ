package com.pinresq.backend.service;

import com.pinresq.backend.dto.ReportRequest;
import com.pinresq.backend.model.Report;
import com.pinresq.backend.repository.ReportRepository;
import com.pinresq.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final VolunteerMatchingService matchingService;

    public ReportService(ReportRepository reportRepository, UserRepository userRepository, VolunteerMatchingService matchingService) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.matchingService = matchingService;
    }

    /** Create and save a new emergency report */
    public Report createReport(ReportRequest request) {
        Long userId = Objects.requireNonNull(request.getUserId(), "User ID must not be null");

        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with id: " + userId);
        }

        Report report = new Report();
        report.setLatitude(request.getLatitude());
        report.setLongitude(request.getLongitude());
        report.setUserId(userId);

        // Wizard data (fall back to @PrePersist defaults if null)
        if (request.getSeverity()         != null) report.setSeverity(request.getSeverity());
        if (request.getVehiclesInvolved() != null) report.setVehiclesInvolved(request.getVehiclesInvolved());
        if (request.getFireSmokePresent() != null) report.setFireSmokePresent(request.getFireSmokePresent());
        if (request.getHasVideo()         != null) report.setHasVideo(request.getHasVideo());

        // Phase 3B: new fields
        if (request.getType()             != null) report.setType(request.getType());
        if (request.getDescription()      != null) report.setDescription(request.getDescription());
        if (request.getPriority()         != null) report.setPriority(request.getPriority());

        report.setStatus("RECEIVED");

        Report savedReport = reportRepository.save(report);
        matchingService.notifyNearbyVolunteers(savedReport);

        return savedReport;
    }

    /** Fetch all reports ordered by most recent first */
    public List<Report> getAllReports() {
        return reportRepository.findAllByOrderByTimestampDesc();
    }

    /** Fetch a single report by ID */
    public Report getReportById(Long reportId) {
        Long id = Objects.requireNonNull(reportId, "Report ID must not be null");
        return reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + id));
    }

    /** Update report status */
    public Report updateReportStatus(Long reportId, String status) {
        Report report = getReportById(reportId);
        report.setStatus(status);
        return reportRepository.save(report);
    }

    /** Phase 4B: Compute live dashboard statistics */
    public Map<String, Object> getStats() {
        List<Report> all = reportRepository.findAllByOrderByTimestampDesc();

        long activeCount = all.stream()
                .filter(r -> !"RESOLVED".equalsIgnoreCase(r.getStatus()))
                .count();

        long resolvedToday = all.stream()
                .filter(r -> "RESOLVED".equalsIgnoreCase(r.getStatus()))
                .filter(r -> r.getTimestamp() != null &&
                             r.getTimestamp().toLocalDate().equals(LocalDateTime.now().toLocalDate()))
                .count();

        long totalVolunteers = userRepository.countByVolunteerModeTrue();

        // Approximate avg response time in minutes (placeholder logic)
        long avgResponseMinutes = activeCount > 0 ? 8L : 0L;

        Map<String, Object> stats = new HashMap<>();
        stats.put("activeCount", activeCount);
        stats.put("resolvedToday", resolvedToday);
        stats.put("totalVolunteers", totalVolunteers);
        stats.put("avgResponseMinutes", avgResponseMinutes);
        stats.put("totalReports", all.size());
        return stats;
    }
}
