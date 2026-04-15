import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

// ── Auth ─────────────────────────────────────────────────────────────────────
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser    = (data) => API.post('/auth/login', data);

// ── Reports ──────────────────────────────────────────────────────────────────
export const createReport   = (data) => API.post('/reports/create', data);
export const getAllReports   = ()     => API.get('/reports/all');
export const getReportById  = (id)   => API.get(`/reports/${id}`);

// ── Users ────────────────────────────────────────────────────────────────────
export const getUserProfile    = (id) => API.get(`/users/${id}`);
export const toggleVolunteer   = (id) => API.put(`/users/${id}/volunteer`);

export default API;
