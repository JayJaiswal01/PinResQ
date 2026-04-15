import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'User';

  const [showModal, setShowModal] = useState(false);

  const handleSOSClick = () => setShowModal(true);
  const handleConfirm  = () => { setShowModal(false); navigate('/report'); };
  const handleCancel   = () => setShowModal(false);

  return (
    <div className="home-page">
      {/* Header */}
      <header className="home-header">
        <span className="home-logo">🚨</span>
        <div>
          <h2 className="home-title">PinResQ</h2>
          <p className="home-greeting">Welcome back, <strong>{userName}</strong></p>
        </div>
      </header>

      {/* Main SOS area */}
      <main className="home-main">
        <p className="home-subtitle">Tap the button below to instantly report an emergency in your area</p>

        <div className="sos-wrapper">
          <div className="pulse-ring idle-ring"></div>
          <button
            id="sos-report-btn"
            className="sos-btn"
            onClick={handleSOSClick}
            aria-label="Report Emergency"
          >
            <span className="sos-icon">🆘</span>
            <span className="sos-label">REPORT</span>
            <span className="sos-sublabel">EMERGENCY</span>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="home-info-cards">
          <div className="info-card" id="info-response-time">
            <span className="info-icon">⚡</span>
            <span className="info-label">Response</span>
            <span className="info-value">≤5 sec</span>
          </div>
          <div className="info-card" id="info-accuracy">
            <span className="info-icon">📍</span>
            <span className="info-label">GPS Accuracy</span>
            <span className="info-value">&gt;95%</span>
          </div>
          <div className="info-card" id="info-uptime">
            <span className="info-icon">🛡️</span>
            <span className="info-label">Uptime</span>
            <span className="info-value">99%+</span>
          </div>
        </div>
      </main>

      {/* ── Confirmation Modal ──────────────────────────────────────────────── */}
      {showModal && (
        <div className="modal-overlay" id="confirm-modal-overlay" onClick={handleCancel}>
          <div className="modal-card" id="confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-warning-icon">⚠️</div>
            <h2 className="modal-title">Report Emergency?</h2>
            <p className="modal-desc">
              Only report real emergencies. False reports may result in penalties and delay actual emergency responses.
            </p>
            <div className="modal-actions">
              <button id="modal-cancel-btn" className="modal-cancel" onClick={handleCancel}>
                Cancel
              </button>
              <button id="modal-confirm-btn" className="modal-confirm" onClick={handleConfirm}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <Navbar active="home" />
    </div>
  );
}
