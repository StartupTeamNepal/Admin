import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from './authStorage'; // adjust path

const baseURL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// No interceptors here, so a 401 from the refresh call can't loop
const refreshClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

const REFRESH_URL = '/api/admin/v1/auth/refresh-token';

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let isRefreshing = false;
let waiting: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function flushQueue(error: unknown, token: string | null) {
  waiting.forEach(({ resolve, reject }) =>
    error || !token ? reject(error) : resolve(token)
  );
  waiting = [];
}

function logout() {
  clearTokens();
  window.location.href = '/login'; // change to your actual login route
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryableConfig | undefined;

    if (error.response?.status !== 401 || !original) {
      return Promise.reject(error);
    }

    // Don't refresh for auth endpoints (a wrong password is also a 401)
    const url = original.url || '';
    if (
      url.includes('/auth/login') ||
      url.includes('/auth/refresh-token') ||
      url.includes('/auth/register') ||
      url.includes('/auth/verify')
    ) {
      return Promise.reject(error);
    }

    if (original._retry) {
      logout();
      return Promise.reject(error);
    }
    original._retry = true;

    // A refresh is already running: wait for it, then retry
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        waiting.push({ resolve, reject });
      }).then((newToken) => {
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      });
    }

    isRefreshing = true;

    try {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();
      if (!accessToken || !refreshToken) throw new Error('Missing tokens');

      const res = await refreshClient.post(REFRESH_URL, {
        accessToken,
        refreshToken,
      });

      // Handles both { success, data: {...} } and a flat response
      const payload = res.data?.data ?? res.data;

      if (!payload?.token) throw new Error('Invalid refresh response');

      setTokens({
        accessToken: payload.token,
        refreshToken: payload.refreshToken,
        expiresAt: payload.expiresAt,
      });

      flushQueue(null, payload.token);

      original.headers.Authorization = `Bearer ${payload.token}`;
      return api(original);
    } catch (refreshError) {
      flushQueue(refreshError, null);
      logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;