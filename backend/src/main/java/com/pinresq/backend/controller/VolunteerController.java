package com.pinresq.backend.controller;

import com.pinresq.backend.model.VolunteerResponse;
import com.pinresq.backend.service.IncidentActionService;
import com.pinresq.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/volunteer")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"})
public class VolunteerController {

    private final IncidentActionService incidentActionService;
    private final UserService userService;

    @Autowired
    public VolunteerController(IncidentActionService incidentActionService, UserService userService) {
        this.incidentActionService = incidentActionService;
        this.userService = userService;
    }

    /** POST /api/volunteer/toggle – existing logic to switch volunteer mode */
    @PutMapping("/toggle/{userId}")
    public ResponseEntity<?> toggleVolunteer(@PathVariable Long userId) {
        try {
            com.pinresq.backend.dto.UserResponse response = userService.toggleVolunteerMode(userId);
            return ResponseEntity.ok(Map.of("volunteerMode", response.getVolunteerMode()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /** POST /api/volunteer/respond – volunteer accepts or rejects incident */
    @PostMapping("/respond")
    public ResponseEntity<?> respondToIncident(
            @RequestParam Long reportId,
            @RequestParam Long volunteerId,
            @RequestParam String status) {
        try {
            VolunteerResponse response = incidentActionService.respondToIncident(reportId, volunteerId, status);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
