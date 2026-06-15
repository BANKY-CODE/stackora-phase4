import Cookies from 'js-cookie';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// ── Token helpers ──────────────────────────────────────────────
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('stackora_access_token');
}

export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem('stackora_access_token', accessToken);
  Cookies.set('stackora_refresh_token', refreshToken, { expires: 7, sameSite: 'lax' });
}

export function clearTokens() {
  localStorage.removeItem('stackora_access_token');
  Cookies.remove('stackora_refresh_token');
}

export function getRefreshToken(): string | null {
  return Cookies.get('stackora_refresh_token') || null;
}

// ── Fetch wrapper ──────────────────────────────────────────────
async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  withAuth = true,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (withAuth) {
    const token = getAccessToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  // Auto-refresh on 401
  if (res.status === 401 && withAuth) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      const token = getAccessToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const retry = await fetch(`${API_BASE}${path}`, { ...options, headers });
      if (!retry.ok) {
        clearTokens();
        window.location.href = '/login';
        throw new Error('Session expired');
      }
      return retry.json();
    } else {
      clearTokens();
      window.location.href = '/login';
      throw new Error('Session expired');
    }
  }

  const data = await res.json();
  if (!res.ok) throw Object.assign(new Error(data.message || 'Request failed'), { status: res.status, data });
  return data;
}

async function tryRefresh(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;
  try {
    const data = await apiFetch<{ data: { accessToken: string; refreshToken: string } }>(
      '/auth/refresh',
      { method: 'POST', body: JSON.stringify({ refreshToken }) },
      false,
    );
    setTokens(data.data.accessToken, data.data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

// ── Auth API ───────────────────────────────────────────────────
export const authApi = {
  register: (body: {
    username: string; email: string; password: string;
    firstName?: string; lastName?: string; country?: string;
  }) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(body) }, false),

  login: (email: string, password: string) =>
    apiFetch<{ data: { user: import('@/types').User; accessToken: string; refreshToken: string } }>(
      '/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }, false,
    ),

  me: () => apiFetch<{ data: { user: import('@/types').User } }>('/auth/me'),

  logout: (refreshToken: string) =>
    apiFetch('/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken }) }),

  logoutAll: () => apiFetch('/auth/logout-all', { method: 'POST' }),

  forgotPassword: (email: string) =>
    apiFetch('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }, false),

  resetPassword: (token: string, password: string) =>
    apiFetch('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) }, false),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiFetch('/auth/change-password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) }),

  resendVerification: () =>
    apiFetch('/auth/resend-verification', { method: 'POST' }),
};

// ── Users API ──────────────────────────────────────────────────
export const usersApi = {
  updateProfile: (data: {
    firstName?: string; lastName?: string;
    bio?: string; phone?: string; country?: string;
  }) => apiFetch('/users/me/profile', { method: 'PUT', body: JSON.stringify(data) }),

  getProfile: () => apiFetch<{ data: { user: import('@/types').User } }>('/users/me/profile'),
};
