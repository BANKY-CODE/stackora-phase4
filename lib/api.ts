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

// ── Wallet API ─────────────────────────────────────────────────
export const walletApi = {
  getBalance: () =>
    apiFetch<{ data: { balance: number; balanceKobo: number; currency: string; isFrozen: boolean; accountNumber: string | null } }>(
      '/wallet/balance',
    ),

  getTransactions: (page = 1, limit = 20) =>
    apiFetch<{
      data: Array<{
        id: string;
        type: string;
        direction: string;
        amountKobo: number;
        amountNaira: number;
        balanceAfterNaira: number | null;
        status: string;
        reference: string;
        description: string;
        createdAt: string;
      }>;
      meta: { total: number; page: number; limit: number };
    }>(`/wallet/transactions?page=${page}&limit=${limit}`),

  resolveAccount: (accountNumber: string) =>
    apiFetch<{ data: { accountNumber: string; name: string; username: string } }>(
      `/wallet/resolve/${accountNumber}`,
    ),

  transfer: (recipientAccountNumber: string, amount: number, note?: string) =>
    apiFetch<{ data: { reference: string; amountNaira: number; recipient: string; recipientAccountNumber: string; balanceAfterNaira: number } }>(
      '/wallet/transfer',
      { method: 'POST', body: JSON.stringify({ recipientAccountNumber, amount, note }) },
    ),
};

// ── Marketplace API ────────────────────────────────────────────
export const marketplaceApi = {
  listProducts: (category?: string) =>
    apiFetch<{ data: Array<{
      id: string;
      title: string;
      description: string | null;
      category: string;
      priceNaira: number;
      coverUrl: string | null;
      contentUrl: string | null;
      salesCount: number;
      seller: string | null;
      sellerName: string | null;
      createdAt: string;
    }> }>(`/marketplace/products${category ? `?category=${category}` : ''}`),

  getProduct: (id: string) =>
    apiFetch<{ data: {
      id: string;
      title: string;
      description: string | null;
      category: string;
      priceNaira: number;
      coverUrl: string | null;
      contentUrl: string | null;
      salesCount: number;
      seller: string | null;
      sellerName: string | null;
      createdAt: string;
    } }>(`/marketplace/products/${id}`),

  createProduct: (data: { title: string; description?: string; category?: string; price: number; coverUrl?: string; contentUrl?: string }) =>
    apiFetch<{ data: { id: string; title: string; status: string } }>(
      '/marketplace/products',
      { method: 'POST', body: JSON.stringify(data) },
    ),

  myProducts: () =>
    apiFetch<{ data: Array<{ id: string; title: string; priceNaira: number; salesCount: number; category: string; createdAt: string }> }>(
      '/marketplace/my-products',
    ),

  myPurchases: () =>
    apiFetch<{ data: Array<{
      purchaseId: string;
      productId: string;
      title: string;
      description: string | null;
      category: string;
      contentUrl: string | null;
      seller: string;
      priceNaira: number;
      purchasedAt: string;
    }> }>('/marketplace/my-purchases'),

  buyProduct: (id: string) =>
    apiFetch<{ data: { reference: string; title: string; pricePaidNaira: number; balanceAfterNaira: number; contentUrl: string | null } }>(
      `/marketplace/products/${id}/buy`,
      { method: 'POST' },
    ),

  pendingProducts: () =>
    apiFetch<{ data: Array<{
      id: string;
      title: string;
      description: string | null;
      category: string;
      priceNaira: number;
      contentUrl: string | null;
      seller: string | null;
      sellerName: string | null;
    }> }>('/marketplace/pending'),

  pendingCount: () =>
    apiFetch<{ data: { count: number } }>('/marketplace/pending/count'),

  approveProduct: (id: string) =>
    apiFetch<{ data: { id: string; title: string } }>(
      `/marketplace/products/${id}/approve`,
      { method: 'POST' },
    ),

  rejectProduct: (id: string) =>
    apiFetch<{ data: { id: string; title: string } }>(
      `/marketplace/products/${id}/reject`,
      { method: 'POST' },
    ),
};

// ── Academy API ────────────────────────────────────────────────
export const academyApi = {
  listCourses: () =>
    apiFetch<{ data: Array<{
      id: string;
      title: string;
      description: string | null;
      category: string;
      level: string;
      priceNaira: number;
      isFree: boolean;
      coverUrl: string | null;
      lessonCount: number;
      createdAt: string;
    }> }>('/academy/courses'),

  getCourse: (id: string) =>
    apiFetch<{ data: {
      id: string;
      title: string;
      description: string | null;
      category: string;
      level: string;
      priceNaira: number;
      isFree: boolean;
      coverUrl: string | null;
      createdAt: string;
      lessons: Array<{
        id: string;
        courseId: string;
        title: string;
        videoUrl: string | null;
        content: string | null;
        position: number;
      }>;
    } }>(`/academy/courses/${id}`),

  createCourse: (data: { title: string; description?: string; category?: string; level?: string; price?: number; coverUrl?: string }) =>
    apiFetch<{ data: { id: string; title: string } }>(
      '/academy/courses',
      { method: 'POST', body: JSON.stringify(data) },
    ),

  updateCourse: (id: string, data: { title?: string; description?: string; category?: string; level?: string; price?: number; coverUrl?: string }) =>
    apiFetch<{ data: { id: string; title: string } }>(
      `/academy/courses/${id}`,
      { method: 'PUT', body: JSON.stringify(data) },
    ),

  deleteCourse: (id: string) =>
    apiFetch<{ data: { deleted: boolean } }>(
      `/academy/courses/${id}`,
      { method: 'DELETE' },
    ),

  addLesson: (courseId: string, data: { title: string; videoUrl?: string; content?: string; position?: number }) =>
    apiFetch<{ data: { id: string; title: string } }>(
      `/academy/courses/${courseId}/lessons`,
      { method: 'POST', body: JSON.stringify(data) },
    ),

  deleteLesson: (lessonId: string) =>
    apiFetch<{ data: { deleted: boolean } }>(
      `/academy/lessons/${lessonId}`,
      { method: 'DELETE' },
    ),
};
