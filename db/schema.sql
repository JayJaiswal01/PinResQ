-- PinResQ Database Schema

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    volunteer_mode BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    timestamp DATETIME NOT NULL,
    user_id BIGINT NOT NULL,
    severity VARCHAR(50),
    vehicles_involved INT,
    fire_smoke_present BOOLEAN,
    has_video BOOLEAN,
    status VARCHAR(50) DEFAULT 'RECEIVED',
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS incident_updates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    report_id BIGINT NOT NULL,
    status_update VARCHAR(255),
    update_time DATETIME NOT NULL,
    FOREIGN KEY (report_id) REFERENCES reports(id)
);

CREATE TABLE IF NOT EXISTS volunteer_responses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    report_id BIGINT NOT NULL,
    volunteer_id BIGINT NOT NULL,
    response_time DATETIME NOT NULL,
    FOREIGN KEY (report_id) REFERENCES reports(id),
    FOREIGN KEY (volunteer_id) REFERENCES users(id)
);

-- New Table for Expanded Database
CREATE TABLE IF NOT EXISTS emergency_resources (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL, -- 'HOSPITAL', 'FIRE_STATION', 'POLICE_STATION'
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    address TEXT,
    contact_number VARCHAR(20)
);
