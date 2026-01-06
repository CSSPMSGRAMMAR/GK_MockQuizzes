import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { validateAdminCredentials } from '@/lib/quizAccess';
import { readUsers } from '@/lib/userStorage';

/**
 * NextAuth.js configuration
 * Supports both user and admin authentication via credentials
 */
export const authOptions: NextAuthOptions = {
  providers: [
    // Unified credentials provider for both users and admins
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' }, // 'user' or 'admin'
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Username and password are required');
        }

        const role = credentials.role || 'user';

        // Try admin authentication if role is 'admin'
        if (role === 'admin') {
          if (validateAdminCredentials(credentials.username, credentials.password)) {
            return {
              id: 'admin',
              name: 'Admin',
              username: credentials.username,
              role: 'admin',
            };
          }
          throw new Error('Invalid admin credentials');
        }

        // Try user authentication
        try {
          const users = await readUsers();
          const user = users.find(
            (u) => u.username === credentials.username && u.password === credentials.password
          );

          if (user) {
            return {
              id: user.id,
              name: user.name,
              username: user.username,
              role: 'user',
            };
          }
        } catch (error) {
          console.error('Error during user authentication:', error);
        }

        throw new Error('Invalid credentials');
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).username = token.username;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'pms-gk-quiz-secret-key-change-in-production',
};

