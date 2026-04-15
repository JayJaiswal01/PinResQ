import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { createReport } from '../services/api';
import './ReportWizardPage.css';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl:       require('leaflet/dist/images/marker-icon.png'),
  shadowUrl:     require('leaflet/dist/images/marker-shadow.png'),
});

const redPin = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const STEPS = ['Video', 'Location', 'Details', 'Review'];

/** Draggable marker that updates parent position state */
function DraggableMarker({ position, onDrag }) {
  useMapEvents({
    click(e) { onDrag([e.latlng.lat, e.latlng.lng]); },
  });
  return position ? (
    <Marker
      position={position}
      icon={redPin}
      draggable
      eventHandlers={{ dragend: (e) => onDrag([e.target.getLatLng().lat, e.target.getLatLng().lng]) }}
    />
  ) : null;
}

export default function ReportWizardPage() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  // ── Wizard state ──────────────────────────────────────────────────────────
  const [step, setStep]           = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Step 1: Video
  const [videoState, setVideoState]   = useState('idle'); // idle | recording | done
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoSize, setVideoSize]     = useState(0);
  const videoTimerRef                 = useRef(null);

  // Step 2: Location
  const [position, setPosition]   = useState(null);
  const [locating, setLocating]   = useState(false);

  // Step 3: Details
  const [severity, setSeverity]           = useState('Moderate');
  const [fireSmoke, setFireSmoke]         = useState(false);
  const [vehicles, setVehicles]           = useState(1);

  // ── Auto-fetch GPS on step 2 ──────────────────────────────────────────────
  useEffect(() => {
    if (step === 2 && !position) {
      setLocating(true);
      navigator.geolocation?.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
          setLocating(false);
        },
        () => setLocating(false),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Video recording simulation ────────────────────────────────────────────
  const startRecording = () => {
    setVideoState('recording');
    setVideoDuration(0);
    videoTimerRef.current = setInterval(() => {
      setVideoDuration(prev => {
        if (prev >= 15) {
          clearInterval(videoTimerRef.current);
          setVideoState('done');
          setVideoSize(+(Math.random() * 20 + 8).toFixed(1)); // 8–28 MB
          return 15;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideoState('done');
    setVideoDuration(Math.round(file.size / 200000)); // rough estimate
    setVideoSize(+(file.size / 1024 / 1024).toFixed(1));
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!position) return;
    setSubmitting(true);
    try {
      const payload = {
        latitude:         position[0],
        longitude:        position[1],
        userId:           parseInt(userId),
        severity,
        vehiclesInvolved: vehicles,
        fireSmokePresent: fireSmoke,
        hasVideo:         videoState === 'done',
      };
      const res = await createReport(payload);
      const reportId = res.data.report.id;
      navigate(`/report/status/${reportId}`);
    } catch {
      alert('Failed to submit report. Please try again.');
      setSubmitting(false);
    }
  };

  // ── Step renderer ─────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (step) {
      // ── STEP 1: VIDEO ───────────────────────────────────────────────────
      case 1:
        return (
          <div className="wizard-step">
            <h2 className="step-title">📹 Capture Scene</h2>
            <p className="step-desc">Record a short video (15–30 sec) of the accident scene to help verify the incident.</p>

            <div className={`video-box ${videoState}`}>
              {videoState === 'idle' && (
                <>
                  <div className="video-icon">🎥</div>
                  <p className="video-hint">Tap to start recording</p>
                  <div className="video-actions">
                    <button id="start-recording-btn" className="record-btn" onClick={startRecording}>
                      ⏺ Start Recording
                    </button>
                    <label className="upload-btn" htmlFor="video-upload">
                      📁 Upload Video
                      <input id="video-upload" type="file" accept="video/*" style={{ display: 'none' }} onChange={handleFileUpload} />
                    </label>
                  </div>
                </>
              )}

              {videoState === 'recording' && (
                <div className="recording-state">
                  <div className="rec-dot"></div>
                  <div className="rec-timer">{String(Math.floor(videoDuration / 60)).padStart(2, '0')}:{String(videoDuration % 60).padStart(2, '0')}</div>
                  <p className="rec-label">REC — {15 - videoDuration}s remaining</p>
                  <div className="rec-bar-track">
                    <div className="rec-bar-fill" style={{ width: `${(videoDuration / 15) * 100}%` }}></div>
                  </div>
                </div>
              )}

              {videoState === 'done' && (
                <div className="video-success">
                  <div className="video-check">✅</div>
                  <p className="video-done-label">Video recorded</p>
                  <div className="video-meta">
                    <span>⏱ {videoDuration}s</span>
                    <span>📦 {videoSize} MB</span>
                  </div>
                  <button className="redo-btn" onClick={() => { clearInterval(videoTimerRef.current); setVideoState('idle'); }}>
                    Redo
                  </button>
                </div>
              )}
            </div>

            <div className="wizard-nav">
              <button className="skip-btn" onClick={() => setStep(2)}>Skip for now →</button>
              {videoState === 'done' && (
                <button id="step1-next-btn" className="next-btn" onClick={() => setStep(2)}>
                  Next →
                </button>
              )}
            </div>
          </div>
        );

      // ── STEP 2: LOCATION ────────────────────────────────────────────────
      case 2:
        return (
          <div className="wizard-step">
            <h2 className="step-title">📍 Confirm Location</h2>
            <p className="step-desc">Your GPS coordinates have been captured. Drag the pin or tap the map to adjust if inaccurate.</p>

            {locating && <div className="loc-loading">📡 Getting your location…</div>}

            <div className="mini-map-wrapper" id="wizard-map">
              {position ? (
                <MapContainer center={position} zoom={16} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap'
                  />
                  <DraggableMarker position={position} onDrag={setPosition} />
                </MapContainer>
              ) : (
                <div className="map-placeholder">📍 Acquiring GPS…</div>
              )}
            </div>

            {position && (
              <div className="coords-card">
                <div className="coords-row">
                  <span className="coords-label">📌 Coordinates</span>
                  <span className="coords-value">{position[0].toFixed(5)}, {position[1].toFixed(5)}</span>
                </div>
                <div className="coords-hint">Tap map or drag pin to adjust</div>
              </div>
            )}

            <div className="wizard-nav">
              <button className="back-btn" onClick={() => setStep(1)}>← Back</button>
              <button
                id="step2-next-btn"
                className="next-btn"
                onClick={() => setStep(3)}
                disabled={!position}
              >
                Next →
              </button>
            </div>
          </div>
        );

      // ── STEP 3: DETAILS ─────────────────────────────────────────────────
      case 3:
        return (
          <div className="wizard-step">
            <h2 className="step-title">📋 Incident Details</h2>
            <p className="step-desc">Quick assessment to help dispatch the right resources.</p>

            {/* Severity */}
            <div className="detail-block">
              <label className="detail-label">Injury Severity</label>
              <div className="severity-selector" role="group">
                {['Minor', 'Moderate', 'Severe'].map((s) => (
                  <button
                    key={s}
                    id={`severity-${s.toLowerCase()}`}
                    className={`severity-btn severity-${s.toLowerCase()} ${severity === s ? 'active' : ''}`}
                    onClick={() => setSeverity(s)}
                  >
                    {s === 'Minor' && '🟡'} {s === 'Moderate' && '🟠'} {s === 'Severe' && '🔴'} {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Fire / Smoke */}
            <div className="detail-block">
              <label className="detail-label">Fire or Smoke Visible</label>
              <div className="fire-toggle-row">
                <span className="fire-status">{fireSmoke ? '🔥 Yes — Fire/Smoke present' : '✅ No fire or smoke'}</span>
                <button
                  id="fire-smoke-toggle"
                  className={`toggle-btn ${fireSmoke ? 'toggle-on' : 'toggle-off'}`}
                  onClick={() => setFireSmoke(!fireSmoke)}
                  aria-pressed={fireSmoke}
                >
                  <span className="toggle-knob"></span>
                </button>
              </div>
            </div>

            {/* Vehicles */}
            <div className="detail-block">
              <label className="detail-label">Vehicles Involved</label>
              <div className="counter-row">
                <button
                  id="vehicles-minus"
                  className="counter-btn"
                  onClick={() => setVehicles(v => Math.max(1, v - 1))}
                  aria-label="Decrease vehicles"
                >−</button>
                <span className="counter-value" id="vehicles-count">{vehicles}</span>
                <button
                  id="vehicles-plus"
                  className="counter-btn"
                  onClick={() => setVehicles(v => Math.min(20, v + 1))}
                  aria-label="Increase vehicles"
                >+</button>
              </div>
            </div>

            <div className="wizard-nav">
              <button className="back-btn" onClick={() => setStep(2)}>← Back</button>
              <button id="step3-next-btn" className="next-btn" onClick={() => setStep(4)}>Review →</button>
            </div>
          </div>
        );

      // ── STEP 4: REVIEW ──────────────────────────────────────────────────
      case 4:
        return (
          <div className="wizard-step">
            <h2 className="step-title">📄 Report Summary</h2>
            <p className="step-desc">Review all details before submitting.</p>

            <div className="summary-card" id="report-summary">
              <div className="summary-row">
                <span className="sum-icon">📹</span>
                <div>
                  <span className="sum-label">Video Evidence</span>
                  <span className="sum-value">{videoState === 'done' ? `${videoDuration}s recording attached` : 'Not provided'}</span>
                </div>
              </div>
              <div className="summary-row">
                <span className="sum-icon">📍</span>
                <div>
                  <span className="sum-label">Location</span>
                  <span className="sum-value">
                    {position ? `${position[0].toFixed(5)}, ${position[1].toFixed(5)}` : '—'}
                  </span>
                </div>
              </div>
              <div className="summary-row">
                <span className="sum-icon">🚨</span>
                <div>
                  <span className="sum-label">Injury Severity</span>
                  <span className={`sum-value severity-tag severity-${severity?.toLowerCase()}`}>{severity}</span>
                </div>
              </div>
              <div className="summary-row">
                <span className="sum-icon">🔥</span>
                <div>
                  <span className="sum-label">Fire / Smoke</span>
                  <span className="sum-value">{fireSmoke ? 'Yes — Present' : 'No'}</span>
                </div>
              </div>
              <div className="summary-row">
                <span className="sum-icon">🚗</span>
                <div>
                  <span className="sum-label">Vehicles Involved</span>
                  <span className="sum-value">{vehicles}</span>
                </div>
              </div>
            </div>

            <div className="wizard-nav wizard-nav--submit">
              <button className="back-btn" onClick={() => setStep(3)}>← Back</button>
              <button
                id="submit-report-btn"
                className="submit-btn"
                onClick={handleSubmit}
                disabled={submitting || !position}
              >
                {submitting ? <><span className="spinner"></span> Submitting…</> : '🚨 Submit Report'}
              </button>
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="wizard-page">
      {/* Header */}
      <header className="wizard-header">
        <button className="wizard-back" onClick={() => step > 1 ? setStep(step - 1) : navigate('/dashboard')}>
          ←
        </button>
        <h1 className="wizard-title">Report Emergency</h1>
        <span className="wizard-step-count">{step}/4</span>
      </header>

      {/* Progress bar */}
      <div className="wizard-progress">
        {STEPS.map((label, i) => (
          <div key={label} className={`progress-step ${i + 1 <= step ? 'active' : ''} ${i + 1 < step ? 'done' : ''}`}>
            <div className="progress-dot">{i + 1 < step ? '✓' : i + 1}</div>
            <span className="progress-label">{label}</span>
          </div>
        ))}
        <div className="progress-line">
          <div className="progress-fill" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
        </div>
      </div>

      {/* Step content */}
      <div className="wizard-body">
        {renderStep()}
      </div>
    </div>
  );
}
