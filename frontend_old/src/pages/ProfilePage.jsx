import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toggleVolunteer } from '../services/api';
import Navbar from '../components/Navbar';
import './ProfilePage.css';

export default function ProfilePage() {
  const navigate = useNavigate();

  const userId   = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName')  || 'User';
  const userEmail = localStorage.getItem('userEmail') || '';
  const userPhone = localStorage.getItem('userPhone') || 'Not set';

  const [volunteering, setVolunteering] = useState(
    localStorage.getItem('volunteerMode') === 'true'
  );
  const [toggleLoading, setToggleLoading] = useState(false);
  const [toggleMsg,     setToggleMsg]     = useState('');

  const handleVolunteerToggle = async () => {
    setToggleLoading(true);
    setToggleMsg('');
    try {
      const res = await toggleVolunteer(userId);
      const newMode = res.data.user.volunteerMode;
      setVolunteering(newMode);
      localStorage.setItem('volunteerMode', newMode);
      setToggleMsg(newMode ? '✅ Volunteer Mode ON – you will be notified nearby!' : '⬛ Volunteer Mode OFF');
      setTimeout(() => setToggleMsg(''), 3000);
    } catch {
      setToggleMsg('❌ Could not update. Please try again.');
    } finally {
      setToggleLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="profile-page">
      <header className="profile-header">
        <h2 id="profile-page-title">👤 Profile</h2>
      </header>

      <main className="profile-main">
        {/* Avatar */}
        <div className="profile-avatar" id="profile-avatar">
          {userName.charAt(0).toUpperCase()}
        </div>

        {/* User Info Card */}
        <div className="profile-card" id="profile-info-card">
          <div className="profile-field">
            <span className="field-label">Name</span>
            <span className="field-value" id="profile-name">{userName}</span>
          </div>
          <div className="profile-field">
            <span className="field-label">Email</span>
            <span className="field-value" id="profile-email">{userEmail}</span>
          </div>
          <div className="profile-field">
            <span className="field-label">Phone</span>
            <span className="field-value" id="profile-phone">{userPhone}</span>
          </div>
        </div>

        {/* Volunteer Mode Toggle */}
        <div className="volunteer-section" id="volunteer-section">
          <div className="volunteer-info">
            <span className="volunteer-title">🤝 Volunteer Mode</span>
            <span className="volunteer-desc">
              {volunteering
                ? 'You are active – you will be notified of nearby emergencies.'
                : 'Enable to help people near you during emergencies.'}
            </span>
          </div>
          <button
            id="volunteer-toggle-btn"
            className={`toggle-btn ${volunteering ? 'toggle-on' : 'toggle-off'}`}
            onClick={handleVolunteerToggle}
            disabled={toggleLoading}
            aria-pressed={volunteering}
          >
            <span className="toggle-knob"></span>
          </button>
        </div>

        {toggleMsg && (
          <div className="volunteer-feedback" id="volunteer-feedback">{toggleMsg}</div>
        )}

        {/* Stats */}
        <div className="profile-stats" id="profile-stats">
          <div className="stat-card">
            <span className="stat-icon">⭐</span>
            <span className="stat-value">{localStorage.getItem('points') || '0'}</span>
            <span className="stat-label">Points</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🚨</span>
            <span className="stat-value">—</span>
            <span className="stat-label">Reports</span>
          </div>
        </div>

        {/* Logout */}
        <button
          id="logout-btn"
          className="logout-btn"
          onClick={handleLogout}
        >
          🔓 Logout
        </button>
      </main>

      <Navbar active="profile" />
    </div>
  );
}
