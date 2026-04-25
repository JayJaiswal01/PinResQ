package com.pinresq.backend.controller;

import com.pinresq.backend.dto.ReportRequest;
import com.pinresq.backend.model.Report;
import com.pinresq.backend.service.ReportService;
import com.pinresq.backend.service.IncidentActionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"})
public class ReportController {

    private final ReportService reportService;
    private final IncidentActionService incidentActionService;

    @Autowired
    public ReportController(ReportService reportService, IncidentActionService incidentActionService) {
        this.reportService = reportService;
        this.incidentActionService = incidentActionService;
    }

    /** POST /api/reports/create – submit full wizard payload */
    @PostMapping("/create")
    public ResponseEntity<?> createReport(@Valid @RequestBody ReportRequest request) {
        try {
            Report report = reportService.createReport(request);
            return ResponseEntity.ok(Map.of(
                    "message", "Emergency report submitted successfully",
                    "report",  report
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /** POST /api/reports/{id}/updates – add on-scene update */
    @PostMapping("/{id}/updates")
    public ResponseEntity<?> addUpdate(
            @PathVariable Long id,
            @RequestParam(required = false) String notes,
            @RequestParam(required = false) org.springframework.web.multipart.MultipartFile image) {
        try {
            return ResponseEntity.ok(incidentActionService.addUpdate(id, notes, image));
        } catch (java.io.IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Image upload failed: " + e.getMessage()));
        }
    }

    /** GET /api/reports/{id}/updates – get all updates for a report */
    @GetMapping("/{id}/updates")
    public ResponseEntity<?> getUpdates(@PathVariable Long id) {
        return ResponseEntity.ok(incidentActionService.getUpdates(id));
    }

    /** GET /api/reports/all – fetch all reports for the map */
    @GetMapping("/all")
    public ResponseEntity<List<Report>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    /** GET /api/reports/recent – fetch recent reports for the live feed */
    @GetMapping("/recent")
    public ResponseEntity<List<Report>> getRecentReports() {
        // Simplified for now, just returning all recent
        return ResponseEntity.ok(reportService.getAllReports());
    }

    /** GET /api/reports/{id} – fetch one report for the status tracker */
    @GetMapping("/{id}")
    public ResponseEntity<?> getReport(@PathVariable Long id) {
        try {
            Report report = reportService.getReportById(id);
            return ResponseEntity.ok(report);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /** PATCH /api/reports/{id}/status – update status (Admin role) */
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Report updated = reportService.updateReportStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
