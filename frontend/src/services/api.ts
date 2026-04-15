import axios from 'axios';
import { Client } from '@stomp/stompjs';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// ── Auth ─────────────────────────────────────────────────────────────────────
export const registerUser = (data: any) => API.post('/auth/register', data);
export const loginUser    = (data: any) => API.post('/auth/login', data);

// ── Reports ──────────────────────────────────────────────────────────────────
export const createReport   = (data: any) => API.post('/reports/create', data);
export const getAllReports  = ()          => API.get('/reports/all');
export const getReportById  = (id: string | number) => API.get(`/reports/${id}`);
export const getRecentReports = ()        => API.get('/reports/recent');

// ── Updates ──────────────────────────────────────────────────────────────────
export const postUpdate = (reportId: string | number, notes: string, image?: File) => {
  const formData = new FormData();
  formData.append('notes', notes);
  if (image) formData.append('image', image);
  return API.post(`/reports/${reportId}/updates`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const getUpdates = (reportId: string | number) => API.get(`/reports/${reportId}/updates`);

// ── Volunteers ───────────────────────────────────────────────────────────────
export const toggleVolunteer = (userId: string | number) => API.put(`/volunteer/toggle/${userId}`);
export const respondToIncident = (reportId: string | number, volunteerId: string | number, status: string) => 
  API.post('/volunteer/respond', null, {
    params: { reportId, volunteerId, status }
  });

// ── WebSocket ────────────────────────────────────────────────────────────────
export const setupWebSocket = (onConnect: () => void, onMessage: (msg: any) => void, userId?: string | number) => {
  const client = new Client({
    brokerURL: 'ws://localhost:8080/ws',
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  client.onConnect = () => {
    onConnect();
    // Subscribe to general incidents
    client.subscribe('/topic/incidents', (message) => {
      onMessage(JSON.parse(message.body));
    });

    // Subscribe to personal alerts if userId provided
    if (userId) {
      client.subscribe(`/user/${userId}/queue/alerts`, (message) => {
        onMessage({ ...JSON.parse(message.body), isAlert: true });
      });
    }
  };

  client.activate();
  return client;
};

export default API;
