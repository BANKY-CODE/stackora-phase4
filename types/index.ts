export type Role = 'user' | 'instructor' | 'vendor' | 'moderator' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string | null;
  last_name:  string | null;
  bio:        string | null;
  phone:      string | null;
  avatar_url: string | null;
  country:    string;
  is_active:          boolean;
  is_email_verified:  boolean;
  is_2fa_enabled:     boolean;
  last_login_at:      string | null;
  created_at:         string;
  updated_at:         string;
  roles: Role[];
}

export interface AuthTokens {
  accessToken:  string;
  refreshToken: string;
  expiresIn:    string;
}

export interface LoginResponse {
  user:         User;
  accessToken:  string;
  refreshToken: string;
  expiresIn:    string;
}

export interface ApiResponse<T = unknown> {
  success:   boolean;
  message:   string;
  data:      T;
  timestamp: string;
  meta?: {
    total:      number;
    page:       number;
    limit:      number;
    totalPages: number;
  };
}

export interface Notification {
  id:        string;
  type:      'info' | 'success' | 'warning' | 'alert';
  title:     string;
  message:   string;
  read:      boolean;
  createdAt: string;
  link?:     string;
}

export interface ActivityItem {
  id:        string;
  action:    string;
  detail:    string;
  icon:      string;
  color:     string;
  timestamp: string;
}

export interface QuickStat {
  label:  string;
  value:  string;
  change: string;
  up:     boolean;
  icon:   string;
  color:  string;
}
