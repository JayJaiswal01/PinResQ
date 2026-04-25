package com.pinresq.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "emergency_resources")
@Data
@NoArgsConstructor
public class EmergencyResource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String type; // e.g., HOSPITAL, FIRE_STATION, POLICE_STATION

    private Double latitude;

    private Double longitude;

    private String address;

    private String contactNumber;
}
