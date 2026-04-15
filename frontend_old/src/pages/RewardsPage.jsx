import React from 'react';
import Navbar from '../components/Navbar';
import './RewardsPage.css';

const BADGES = [
  { icon: '🥇', label: 'First Responder', desc: 'Submit your 1st report', req: 1  },
  { icon: '🔥', label: 'Quick Hero',      desc: '5 reports submitted',    req: 5  },
  { icon: '🌟', label: 'Community Guardian', desc: '10 reports submitted', req: 10 },
];

export default function RewardsPage() {
  // For now, points come from localStorage (future: fetch from backend)
  const points = parseInt(localStorage.getItem('points') || '0');

  // eslint-disable-next-line no-unused-vars
  const earnedBadges = BADGES.filter((b) => points / 10 >= b.req);

  return (
    <div className="rewards-page">
      <header className="rewards-header">
        <h2 id="rewards-page-title">🎁 Rewards</h2>
      </header>

      <main className="rewards-main">
        {/* Points Display */}
        <div className="points-card" id="points-display">
          <div className="points-icon">⭐</div>
          <div className="points-value">{points}</div>
          <div className="points-label">Total Points</div>
          <div className="points-hint">+10 points per emergency report</div>
        </div>

        {/* Progress bar */}
        <div className="progress-section">
          <div className="progress-label">
            <span>Progress to next badge</span>
            <span>{points % 100}/100 pts</span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${Math.min((points % 100), 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Badges */}
        <div className="badges-section">
          <h3 className="section-title">Badges</h3>
          <div className="badges-grid">
            {BADGES.map((badge) => {
              const earned = points / 10 >= badge.req;
              return (
                <div
                  key={badge.label}
                  className={`badge-card ${earned ? 'badge-earned' : 'badge-locked'}`}
                  id={`badge-${badge.label.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  <span className="badge-icon">{badge.icon}</span>
                  <span className="badge-name">{badge.label}</span>
                  <span className="badge-desc">{badge.desc}</span>
                  {!earned && <span className="badge-lock">🔒</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* How to earn */}
        <div className="how-to-earn">
          <h3 className="section-title">How to Earn Points</h3>
          <ul className="earn-list">
            <li>📍 Report an emergency → <strong>+10 pts</strong></li>
            <li>🤝 Enable Volunteer Mode → <strong>+5 pts</strong></li>
            <li>✅ Verified report → <strong>+15 pts</strong> (coming soon)</li>
          </ul>
        </div>
      </main>

      <Navbar active="rewards" />
    </div>
  );
}
