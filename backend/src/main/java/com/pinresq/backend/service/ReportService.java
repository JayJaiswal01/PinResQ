package com.pinresq.backend.service;

import com.pinresq.backend.dto.ReportRequest;
import com.pinresq.backend.model.Report;
import com.pinresq.backend.repository.ReportRepository;
import com.pinresq.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
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

    /** Create and save a new emergency report from the 4-step wizard */
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

        report.setStatus("RECEIVED");

        Report savedReport = reportRepository.save(report);
        
        // Trigger matching service in a separate thread or just after save
        matchingService.notifyNearbyVolunteers(savedReport);

        return savedReport;
    }

    /** Fetch all reports ordered by most recent first */
    public List<Report> getAllReports() {
        return reportRepository.findAllByOrderByTimestampDesc();
    }

    /** Fetch a single report by ID (used by status tracker) */
    public Report getReportById(Long reportId) {
        Long id = Objects.requireNonNull(reportId, "Report ID must not be null");
        return reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + id));
    }
}
