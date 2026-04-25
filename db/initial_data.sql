-- Initial Seeding for Emergency Resources

-- Hospitals
INSERT INTO emergency_resources (name, type, latitude, longitude, address, contact_number)
VALUES ('City General Hospital', 'HOSPITAL', 28.6139, 77.2090, 'Connaught Place, New Delhi', '011-2345-6789');

INSERT INTO emergency_resources (name, type, latitude, longitude, address, contact_number)
VALUES ('St. Peters Trauma Center', 'HOSPITAL', 28.5355, 77.3910, 'Sector 62, Noida', '0120-111-222');

-- Fire Stations
INSERT INTO emergency_resources (name, type, latitude, longitude, address, contact_number)
VALUES ('Central Fire Station', 'FIRE_STATION', 28.6270, 77.2160, 'Minto Road, New Delhi', '101');

-- Police Stations
INSERT INTO emergency_resources (name, type, latitude, longitude, address, contact_number)
VALUES ('Cyber City Police Hub', 'POLICE_STATION', 28.4595, 77.0266, 'Gurugram, Haryana', '112');
