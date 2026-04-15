package com.pinresq.backend.repository;

import com.pinresq.backend.model.VolunteerResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface VolunteerResponseRepository extends JpaRepository<VolunteerResponse, Long> {
    List<VolunteerResponse> findByReportId(Long reportId);
    Optional<VolunteerResponse> findByReportIdAndVolunteerId(Long reportId, Long volunteerId);
}
