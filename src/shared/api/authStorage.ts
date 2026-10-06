 const ACCESS_TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
const EXPIRES_AT_KEY = "expiresAt";

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function removeAccessToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setExpiresAt(expiresAt: string): void {
  localStorage.setItem(EXPIRES_AT_KEY, expiresAt);
}

export function getExpiresAt(): string | null {
  return localStorage.getItem(EXPIRES_AT_KEY);
}

export function isTokenExpired(): boolean {
  const expiresAt = getExpiresAt();

  if (!expiresAt) {
    return true;
  }

  return new Date(expiresAt).getTime() <= Date.now();
}
 // authStorage.ts (add these)
export function setTokens(data: {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
}): void {
  setAccessToken(data.accessToken);
  if (data.refreshToken) setRefreshToken(data.refreshToken);
  if (data.expiresAt) setExpiresAt(data.expiresAt);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
}