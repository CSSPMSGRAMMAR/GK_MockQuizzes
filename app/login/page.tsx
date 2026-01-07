'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { setUserSession } from '@/lib/auth';
import { BRANDING } from '@/lib/branding';
import { Lock, User, BookOpen, Sparkles, MessageCircle } from 'lucide-react';

export default function UserLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserSession({ id: data.id, username: data.username, name: data.name });
        router.push('/quizzes');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background academic-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        {/* Logo Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <Link href="/" className="inline-flex items-center space-x-3 group mb-4">
            <div className="relative h-16 w-16 rounded-full overflow-hidden shadow-elegant transition-transform duration-300 group-hover:scale-105">
              <Image
                src={BRANDING.logo}
                alt={BRANDING.name}
                fill
                sizes="64px"
                className="object-cover"
                priority
              />
            </div>
            <div>
              <span className="font-display font-bold text-xl bg-academic-gradient bg-clip-text text-transparent block">
                {BRANDING.name}
              </span>
              <p className="text-xs text-muted-foreground font-accent">{BRANDING.tagline}</p>
            </div>
          </Link>
        </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="w-full shadow-elegant border-2 hover:border-primary/50 transition-all">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10 relative">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-display font-bold">PMS GK Quiz Login</CardTitle>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
            Enter your credentials to access the quiz
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs sm:text-sm animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 rounded-md bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Enter username"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 rounded-md bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-sm sm:text-base transition-all hover:shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Logging in...
                </>
              ) : (
                'Login to Quiz'
              )}
            </Button>
          </form>

          {/* WhatsApp Button for Premium Access */}
          <div className="mt-4 space-y-3">
            <a
              href="https://wa.me/923265511188?text=Hello! I would like to get access to premium mock tests."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-md font-medium text-sm sm:text-base transition-all hover:shadow-lg"
            >
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Get Premium Access via WhatsApp</span>
            </a>
          </div>

          <div className="mt-4 text-center text-xs sm:text-sm text-muted-foreground">
            <Link href="/admin/login" className="hover:underline hover:text-primary transition-colors">
              Admin Login
            </Link>
          </div>
        </CardContent>
      </Card>
      </motion.div>
      </div>
    </div>
  );
}
