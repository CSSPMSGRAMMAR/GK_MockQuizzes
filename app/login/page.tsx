'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertCircle, Lock, User } from 'lucide-react';

export default function QuizLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/exam';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/auth/quiz-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Unable to log in. Please check your credentials.');
        return;
      }

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(
          'pmsgk.quizUser',
          JSON.stringify({ username: data.username || username })
        );
      }

      router.push(redirect);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center px-4 py-10">
      <div className="max-w-3xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Left: Course / Exam Teaser */}
        <div className="text-white space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300 font-semibold">
            CSSPMS.GRAMMAR • PMS GK
          </p>
          <h1 className="text-3xl md:text-4xl font-bold leading-snug">
            Secure Access to
            <span className="block text-emerald-300">PMS Punjab GK Full-Length Quiz</span>
          </h1>
          <p className="text-sm md:text-base text-slate-200">
            Only enrolled students can access this timed PMS GK quiz. Use the username and
            password shared with you after registration.
          </p>
          <ul className="space-y-2 text-sm text-slate-200">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              100 MCQs • Negative marking • 120 minutes
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              Designed for PMS Punjab GK — examiner-oriented
            </li>
          </ul>
        </div>

        {/* Right: Login Card */}
        <Card className="backdrop-blur-md bg-white/95 shadow-2xl border-emerald-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lock className="h-5 w-5 text-emerald-600" />
              Quiz Access Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3">
                  <User className="h-4 w-4 text-slate-400" />
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    className="w-full bg-transparent py-2 text-sm outline-none"
                    placeholder="e.g. demo.student"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3">
                  <Lock className="h-4 w-4 text-slate-400" />
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    className="w-full bg-transparent py-2 text-sm outline-none"
                    placeholder="Quiz access password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={submitting}
              >
                {submitting ? 'Signing you in…' : 'Enter Quiz'}
              </Button>

              <p className="mt-2 text-xs text-slate-500">
                Having trouble logging in? Confirm your username/password with the instructor or
                admin.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}


