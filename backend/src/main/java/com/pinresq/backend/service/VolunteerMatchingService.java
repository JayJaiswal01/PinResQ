package com.pinresq.backend.service;

import com.pinresq.backend.model.Report;
import com.pinresq.backend.model.User;
import com.pinresq.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VolunteerMatchingService {

    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public VolunteerMatchingService(UserRepository userRepository, SimpMessagingTemplate messagingTemplate) {
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public void notifyNearbyVolunteers(Report report) {
        java.util.Objects.requireNonNull(report, "Report must not be null");
        // Find all volunteers
        List<User> volunteers = userRepository.findByVolunteerModeTrue();

        // Filter by proximity (5km)
        List<User> matchedVolunteers = volunteers.stream()
                .filter(v -> v.getLastLat() != null && v.getLastLng() != null)
                .filter(v -> calculateDistance(report.getLatitude(), report.getLongitude(),
                        v.getLastLat(), v.getLastLng()) <= 5.0)
                .collect(Collectors.toList());

        // Notify each matched volunteer via their private queue
        for (User volunteer : matchedVolunteers) {
            String userId = String
                    .valueOf(java.util.Objects.requireNonNull(volunteer.getId(), "Volunteer ID must not be null"));
            messagingTemplate.convertAndSendToUser(
                    java.util.Objects.requireNonNull(userId),
                    "/queue/alerts",
                    report);
        }

        // Also broadcast to the general incident feed
        messagingTemplate.convertAndSend("/topic/incidents", report);
    }

    /**
     * Haversine formula to calculate distance in km
     */
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371; // Earth radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
