import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getAllReports } from '../services/api';
import Navbar from '../components/Navbar';
import './MapPage.css';

// Fix leaflet default icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl:       require('leaflet/dist/images/marker-icon.png'),
  shadowUrl:     require('leaflet/dist/images/marker-shadow.png'),
});

// Custom red emergency marker
const emergencyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Blue icon for YOUR location
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

/** Recenter the map whenever userPos changes */
function RecenterMap({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView(coords, 15, { animate: true });
    }
  }, [coords, map]);
  return null;
}

export default function MapPage() {
  const [reports,  setReports]  = useState([]);
  const [userPos,  setUserPos]  = useState(null);   // null = still locating
  const [locError, setLocError] = useState('');
  const [loading,  setLoading]  = useState(true);
  const [apiError, setApiError] = useState('');

  // ── 1. Get precise GPS location ──────────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocError('Geolocation is not supported by your browser.');
      setUserPos([20.5937, 78.9629]); // fallback: India center
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setLocError('Could not get your location. Showing default view.');
        setUserPos([20.5937, 78.9629]); // fallback
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  // ── 2. Fetch all reports from backend ────────────────────────────────────
  useEffect(() => {
    getAllReports()
      .then((res) => setReports(res.data))
      .catch(() => setApiError('Could not load reports. Make sure the backend is running.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="map-page">
      <header className="map-header">
        <h2 id="map-page-title">🗺️ Live Incident Map</h2>
        <span className="map-count">{reports.length} report{reports.length !== 1 ? 's' : ''}</span>
      </header>

      {/* Status banners */}
      {!userPos && (
        <div className="map-locating">📍 Getting your location…</div>
      )}
      {locError && (
        <div className="map-warning">{locError}</div>
      )}
      {loading && (
        <div className="map-loading">Loading reports…</div>
      )}
      {apiError && (
        <div className="map-error">{apiError}</div>
      )}

      {/* Only render the map AFTER we have a position */}
      <div className="map-container" id="leaflet-map">
        {userPos ? (
          <MapContainer
            center={userPos}
            zoom={15}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Keep map centered on user if position updates */}
            <RecenterMap coords={userPos} />

            {/* Blue marker = YOUR location */}
            <Marker position={userPos} icon={userIcon}>
              <Popup>
                <div className="map-popup">
                  <strong>📍 Your Location</strong>
                  <br />
                  <small>{userPos[0].toFixed(5)}, {userPos[1].toFixed(5)}</small>
                </div>
              </Popup>
            </Marker>

            {/* Red markers = reported emergencies */}
            {reports.map((report) => (
              <Marker
                key={report.id}
                position={[report.latitude, report.longitude]}
                icon={emergencyIcon}
              >
                <Popup>
                  <div className="map-popup">
                    <strong>⚠️ Emergency Reported</strong>
                    <br />
                    <span>
                      {report.timestamp
                        ? new Date(report.timestamp).toLocaleString()
                        : 'Unknown time'}
                    </span>
                    <br />
                    <small>
                      {report.latitude.toFixed(5)}, {report.longitude.toFixed(5)}
                    </small>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <div className="map-spinner-wrapper">
            <span className="map-spinner-icon">📍</span>
            <p>Acquiring GPS location…</p>
          </div>
        )}
      </div>

      <Navbar active="map" />
    </div>
  );
}
