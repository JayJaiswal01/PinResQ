import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import './Auth.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginUser(form);
      const { user } = res.data;
      localStorage.setItem('userId',   user.id);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userPhone', user.phone || '');
      localStorage.setItem('volunteerMode', user.volunteerMode);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Dev Bypass (no backend needed) ──────────────────────────────────────
  const devBypass = () => {
    localStorage.setItem('userId',       '1');
    localStorage.setItem('userName',     'Jay Jaiswal');
    localStorage.setItem('userEmail',    'jay@pinresq.dev');
    localStorage.setItem('userPhone',    '+91 98765 43210');
    localStorage.setItem('volunteerMode','false');
    localStorage.setItem('points',       '30');
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo / Brand */}
        <div className="auth-brand">
          <span className="brand-icon">🚨</span>
          <h1 className="brand-name">PinResQ</h1>
          <p className="brand-tagline">Geo-Verified Emergency Response</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? <span className="spinner"></span> : 'Log In'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{' '}
          <Link to="/register" id="goto-register-link">Register here</Link>
        </p>

        {/* ── Dev Bypass ── */}
        <div className="dev-bypass-wrapper">
          <div className="dev-bypass-divider">
            <span>DEV MODE</span>
          </div>
          <button
            id="dev-bypass-btn"
            type="button"
            className="dev-bypass-btn"
            onClick={devBypass}
            title="Bypass login for development (no backend needed)"
          >
            ⚡ Quick Dev Access
          </button>
          <p className="dev-bypass-hint">Logs in as Jay Jaiswal · No backend required</p>
        </div>
      </div>
    </div>
  );
}
