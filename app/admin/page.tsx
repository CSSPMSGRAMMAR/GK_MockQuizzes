'use client';

import { useEffect, useState } from 'react';
import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Shield, UserPlus, Users, AlertCircle, CheckCircle2 } from 'lucide-react';

type AdminUser = {
  username: string;
};

export default function AdminPage() {
  const [adminUsername, setAdminUsername] = useState('NimraG');
  const [adminPassword, setAdminPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/quiz-users');
      const data = await res.json();
      if (Array.isArray(data.users)) {
        setUsers(data.users);
      }
    } catch {
      // ignore fetch errors for now
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (isUnlocked) {
      fetchUsers();
    }
  }, [isUnlocked]);

  const handleUnlock = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUnlocked(true);
    setError(null);
    setSuccess('Admin controls unlocked locally. Use these credentials to add users.');
  };

  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/quiz-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminUsername,
          adminPassword,
          username: newUsername,
          password: newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Unable to add user. Check admin credentials.');
        return;
      }

      setSuccess(`User "${data.user?.username || newUsername}" added successfully.`);
      setNewUsername('');
      setNewPassword('');
      fetchUsers();
    } catch {
      setError('Something went wrong while adding user.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        <div className="space-y-2">
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100">
            Admin • PMS GK Quiz
          </Badge>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
            Quiz Access Management
          </h1>
          <p className="text-sm text-slate-600">
            Use your admin username and password to add students who can log in and attempt the PMS
            GK quiz.
          </p>
        </div>

        {/* Admin unlock */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-5 w-5 text-emerald-600" />
              Admin Credentials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUnlock} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="adminUsername">Admin username</Label>
                <input
                  id="adminUsername"
                  type="text"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="adminPassword">Admin password</Label>
                <input
                  id="adminPassword"
                  type="password"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                Unlock User Management
              </Button>
              <p className="text-xs text-slate-500">
                These credentials are used only on this page and are sent with each request when
                adding quiz users.
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Add users + list */}
        {isUnlocked && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="order-2 md:order-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <UserPlus className="h-5 w-5 text-emerald-600" />
                  Add Quiz User
                </CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-3 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}
                {success && (
                  <div className="mb-3 flex items-start gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <p>{success}</p>
                  </div>
                )}

                <form onSubmit={handleAddUser} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="newUsername">Student username</Label>
                    <input
                      id="newUsername"
                      type="text"
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="e.g. student01"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="newPassword">Student password</Label>
                    <input
                      id="newPassword"
                      type="text"
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="set a password to share with the student"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={submitting}
                  >
                    {submitting ? 'Adding user…' : 'Add Quiz User'}
                  </Button>
                  <p className="text-[11px] text-slate-500">
                    Share this username and password with the student. They will use it on the quiz
                    login page.
                  </p>
                </form>
              </CardContent>
            </Card>

            <Card className="order-1 md:order-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-5 w-5 text-emerald-600" />
                  Current Quiz Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingUsers ? (
                  <p className="text-sm text-slate-500">Loading users…</p>
                ) : users.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No quiz users added yet. Create the first user using the form.
                  </p>
                ) : (
                  <ul className="space-y-1 text-sm">
                    {users.map((u) => (
                      <li
                        key={u.username}
                        className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2"
                      >
                        <span className="font-mono text-xs">{u.username}</span>
                        <span className="text-[11px] text-slate-500">quiz access</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}


