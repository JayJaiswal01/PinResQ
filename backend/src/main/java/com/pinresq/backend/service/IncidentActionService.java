package com.pinresq.backend.service;

import com.pinresq.backend.model.IncidentUpdate;
import com.pinresq.backend.model.Report;
import com.pinresq.backend.model.VolunteerResponse;
import com.pinresq.backend.repository.IncidentUpdateRepository;
import com.pinresq.backend.repository.ReportRepository;
import com.pinresq.backend.repository.VolunteerResponseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class IncidentActionService {

    private final IncidentUpdateRepository updateRepository;
    private final VolunteerResponseRepository responseRepository;
    private final ReportRepository reportRepository;
    private final SimpMessagingTemplate messagingTemplate;

    private static final String UPLOAD_DIR = "uploads/incidents/";

    @Autowired
    public IncidentActionService(IncidentUpdateRepository updateRepository,
                                  VolunteerResponseRepository responseRepository,
                                  ReportRepository reportRepository,
                                  SimpMessagingTemplate messagingTemplate) {
        this.updateRepository = updateRepository;
        this.responseRepository = responseRepository;
        this.reportRepository = reportRepository;
        this.messagingTemplate = messagingTemplate;
        
        // Ensure upload directory exists
        try {
            Files.createDirectories(Paths.get(UPLOAD_DIR));
        } catch (IOException e) {
            System.err.println("Could not create upload directory: " + e.getMessage());
        }
    }

    public IncidentUpdate addUpdate(Long reportId, String notes, MultipartFile file) throws IOException {
        IncidentUpdate update = new IncidentUpdate();
        update.setReportId(reportId);
        update.setNotes(notes);

        if (file != null && !file.isEmpty()) {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path path = Paths.get(UPLOAD_DIR + fileName);
            Files.write(path, file.getBytes());
            update.setImageUrl("/api/uploads/incidents/" + fileName);
        }

        IncidentUpdate savedUpdate = updateRepository.save(update);
        
        // Notify subscribers about the update
        messagingTemplate.convertAndSend("/topic/reports/" + reportId + "/updates", savedUpdate);
        
        return savedUpdate;
    }

    public List<IncidentUpdate> getUpdates(Long reportId) {
        return updateRepository.findByReportIdOrderByCreatedAtDesc(reportId);
    }

    public VolunteerResponse respondToIncident(Long reportId, Long volunteerId, String status) {
        VolunteerResponse response = responseRepository.findByReportIdAndVolunteerId(reportId, volunteerId)
                .orElse(new VolunteerResponse());
        
        response.setReportId(reportId);
        response.setVolunteerId(volunteerId);
        response.setStatus(status);
        
        VolunteerResponse savedResponse = responseRepository.save(response);

        // If accepted, update the report status
        if ("ACCEPTED".equals(status) || "EN_ROUTE".equals(status)) {
            java.util.Objects.requireNonNull(reportId, "reportId must not be null");
            Report report = reportRepository.findById(reportId)
                    .orElseThrow(() -> new RuntimeException("Report not found"));
            report.setStatus(status.equals("ACCEPTED") ? "VERIFIED" : "EN_ROUTE");
            reportRepository.save(report);
            
            // Notify all about report status change
            messagingTemplate.convertAndSend("/topic/incidents", report);
        }

        return savedResponse;
    }
}
