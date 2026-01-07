// Simple authentication utilities
// Hard-coded admin credentials
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123', // Change this in production!
};

// User storage file path
export const USERS_FILE = './data/users.json';

// Session keys
export const ADMIN_SESSION_KEY = 'pms-gk-admin-session';
export const USER_SESSION_KEY = 'pms-gk-user-session';

// Check if user is admin
export function isAdmin(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
}

// Check if user is logged in
export function isUserLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(USER_SESSION_KEY);
}

// Get current user
export function getCurrentUser(): { id?: string; username: string; name: string } | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem(USER_SESSION_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

// Set admin session
export function setAdminSession() {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADMIN_SESSION_KEY, 'true');
}

// Set user session
export function setUserSession(user: { id?: string; username: string; name: string }) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
}

// Clear admin session
export function clearAdminSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

// Clear user session
export function clearUserSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_SESSION_KEY);
}

// Clear all sessions
export function clearAllSessions() {
  clearAdminSession();
  clearUserSession();
}

