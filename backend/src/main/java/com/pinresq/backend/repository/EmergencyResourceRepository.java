package com.pinresq.backend.repository;

import com.pinresq.backend.model.EmergencyResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmergencyResourceRepository extends JpaRepository<EmergencyResource, Long> {
    List<EmergencyResource> findByType(String type);
}
