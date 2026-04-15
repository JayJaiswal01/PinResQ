import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './StatusTrackerPage.css';

// Timeline stages that update progressively
const TIMELINE = [
  { key: 'RECEIVED',   icon: '📋', label: 'Report Received',           delay: 0    },
  { key: 'VERIFYING',  icon: '🔍', label: 'Verification in Progress',  delay: 4000 },
  { key: 'DISPATCHED', icon: '🚒', label: 'Emergency Team Dispatched', delay: 9000 },
  { key: 'EN_ROUTE',   icon: '🏃', label: 'Responders En Route',       delay: 15000 },
];

const STATUS_ORDER = TIMELINE.map(t => t.key);

function getETA(currentStatus) {
  switch (currentStatus) {
    case 'RECEIVED':   return 8;
    case 'VERIFYING':  return 6;
    case 'DISPATCHED': return 4;
    case 'EN_ROUTE':   return 2;
    default:           return 8;
  }
}

export default function StatusTrackerPage() {
  const { id }       = useParams();
  const navigate     = useNavigate();

  const [currentStatus, setCurrentStatus] = useState('RECEIVED');
  const [eta, setEta]                     = useState(8);
  const [volunteersAlerted, setVolunteersAlerted] = useState(false);

  // Simulate progressive status updates (in real app: poll /api/reports/:id)
  useEffect(() => {
    const timers = [];

    TIMELINE.forEach(({ key, delay }) => {
      if (delay === 0) return; // RECEIVED is immediate
      const t = setTimeout(() => {
        setCurrentStatus(key);
        setEta(getETA(key));
      }, delay);
      timers.push(t);
    });

    // Volunteers alerted banner at 6s
    const vt = setTimeout(() => setVolunteersAlerted(true), 6000);
    timers.push(vt);

    return () => timers.forEach(clearTimeout);
  }, []);

  const currentIndex = STATUS_ORDER.indexOf(currentStatus);
  const etaPercent   = Math.round(((8 - eta) / 8) * 100);

  return (
    <div className="tracker-page">
      {/* Header */}
      <header className="tracker-header">
        <button className="tracker-back" onClick={() => navigate('/dashboard')}>←</button>
        <h1 className="tracker-title">Incident #{id}</h1>
        <span className={`tracker-badge badge-${currentStatus.toLowerCase()}`}>{currentStatus.replace('_', ' ')}</span>
      </header>

      <div className="tracker-body">

        {/* ETA Card */}
        <div className="eta-card" id="eta-card">
          <div className="eta-top">
            <div>
              <p className="eta-label">Estimated Arrival</p>
              <p className="eta-value" id="eta-minutes">{eta} <span>min</span></p>
            </div>
            <div className="eta-icon">🚑</div>
          </div>
          <div className="eta-bar-track">
            <div className="eta-bar-fill" style={{ width: `${etaPercent}%` }}></div>
          </div>
          <p className="eta-hint">Emergency team is being dispatched to your location</p>
        </div>

        {/* Volunteer Alert Banner */}
        {volunteersAlerted && (
          <div className="volunteer-alert" id="volunteer-alert">
            <span className="vol-icon">🤝</span>
            <div>
              <p className="vol-title">Nearby Volunteers Alerted</p>
              <p className="vol-desc">Community members within 2km have been notified</p>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="timeline-section">
          <h3 className="timeline-heading">Response Timeline</h3>
          <div className="timeline" id="response-timeline">
            {TIMELINE.map(({ key, icon, label }, i) => {
              const isDone    = i <= currentIndex;
              const isCurrent = i === currentIndex;
              return (
                <div key={key} className={`timeline-item ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
                  <div className="timeline-icon-col">
                    <div className="timeline-dot">
                      {isDone ? (isCurrent ? icon : '✓') : ''}
                    </div>
                    {i < TIMELINE.length - 1 && (
                      <div className={`timeline-connector ${i < currentIndex ? 'filled' : ''}`}></div>
                    )}
                  </div>
                  <div className="timeline-content">
                    <p className="timeline-label">{label}</p>
                    {isCurrent && <p className="timeline-sub">In progress…</p>}
                    {isDone && !isCurrent && <p className="timeline-sub timeline-done-msg">Completed ✓</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="emergency-contacts">
          <h3 className="timeline-heading">Emergency Contacts</h3>
          <div className="contact-list">
            <a href="tel:112" id="call-112" className="contact-btn contact-primary">
              📞 Call 112 — Police
            </a>
            <a href="tel:108" id="call-108" className="contact-btn contact-ambulance">
              🚑 Call 108 — Ambulance
            </a>
            <a href="tel:101" id="call-101" className="contact-btn contact-fire">
              🔥 Call 101 — Fire
            </a>
          </div>
        </div>

        {/* Done button */}
        <button
          id="tracker-done-btn"
          className="tracker-done-btn"
          onClick={() => navigate('/dashboard')}
        >
          Return to Dashboard
        </button>

      </div>
    </div>
  );
}
