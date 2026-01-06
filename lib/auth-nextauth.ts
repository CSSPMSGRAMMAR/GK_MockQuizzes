/**
 * NextAuth.js helper functions
 * Wrapper around NextAuth for easier usage throughout the app
 */
import { getServerSession } from 'next-auth';
import { authOptions } from './auth-config';

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}

export async function isAuthenticated() {
  const session = await getSession();
  return !!session;
}

export async function isAdminUser() {
  const session = await getSession();
  return (session?.user as any)?.role === 'admin';
}

export async function isRegularUser() {
  const session = await getSession();
  return (session?.user as any)?.role === 'user';
}

