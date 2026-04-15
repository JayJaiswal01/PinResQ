package com.pinresq.backend.repository;

import com.pinresq.backend.model.IncidentUpdate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IncidentUpdateRepository extends JpaRepository<IncidentUpdate, Long> {
    List<IncidentUpdate> findByReportIdOrderByCreatedAtDesc(Long reportId);
}
