import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  getExpiresAt,
  setTokens,
  clearTokens,
} from './authStorage';

const baseURL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// No interceptors, so the refresh call can't loop
const refreshClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

const REFRESH_URL = '/api/admin/v1/auth/refresh-token';
const AUTH_PATHS = ['/auth/login', '/auth/refresh-token', '/auth/register', '/auth/verify'];

const isAuthUrl = (url = '') => AUTH_PATHS.some((p) => url.includes(p));

// Treat the token as expired 30s early; trim .NET's 7-digit fraction to 3
function isExpiredSoon(bufferMs = 30_000): boolean {
  const raw = getExpiresAt();
  if (!raw) return false; // unknown: let the 401 fallback handle it
  const ms = Date.parse(raw.replace(/(\.\d{3})\d+/, '$1'));
  if (Number.isNaN(ms)) return false;
  return ms - bufferMs <= Date.now();
}

function logout() {
  clearTokens();
  window.location.href = '/login';
}

// One shared in-flight refresh for all callers
let refreshPromise: Promise<string> | null = null;

function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();
      if (!accessToken || !refreshToken) throw new Error('Missing tokens');

      const res = await refreshClient.post(REFRESH_URL, {
        accessToken,
        refreshToken,
      });

      const payload = res.data?.data ?? res.data;
      if (!payload?.token) throw new Error('Invalid refresh response');

      setTokens({
        accessToken: payload.token,
        refreshToken: payload.refreshToken,
        expiresAt: payload.expiresAt,
      });
      return payload.token as string;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

// Proactive refresh + attach token
api.interceptors.request.use(async (config) => {
  if (!isAuthUrl(config.url) && getAccessToken() && isExpiredSoon()) {
    try {
      await refreshAccessToken();
    } catch (err) {
      logout();
      return Promise.reject(err);
    }
  }
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

// Fallback: server says 401 anyway
api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as RetryableConfig | undefined;

    if (error.response?.status !== 401 || !original || isAuthUrl(original.url)) {
      return Promise.reject(error);
    }
    if (original._retry) {
      logout();
      return Promise.reject(error);
    }
    original._retry = true;

    try {
      const newToken = await refreshAccessToken();
      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch (refreshError) {
      logout();
      return Promise.reject(refreshError);
    }
  }
);

export default api;