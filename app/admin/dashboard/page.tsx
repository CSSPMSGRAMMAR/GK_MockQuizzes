'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { isAdmin, clearAdminSession } from '@/lib/auth';
import { BRANDING } from '@/lib/branding';
import {
  UserPlus,
  Users,
  LogOut,
  Trash2,
  Plus,
  X,
  Shield,
} from 'lucide-react';

interface User {
  id: string;
  username: string;
  name: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Check admin authentication
    if (!isAdmin()) {
      router.push('/admin/login');
      return;
    }

    loadUsers();
  }, [router]);

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.username || !formData.password || !formData.name) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('User created successfully!');
        setFormData({ username: '', password: '', name: '' });
        setShowAddForm(false);
        loadUsers();
      } else {
        setError(data.error || 'Failed to create user');
      }
    } catch (err) {
      setError('Failed to create user. Please try again.');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await fetch(`/api/users?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('User deleted successfully!');
        loadUsers();
      } else {
        setError('Failed to delete user');
      }
    } catch (err) {
      setError('Failed to delete user. Please try again.');
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background academic-hero">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link href="/" className="flex items-center space-x-3 group shrink-0">
              <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden shadow-elegant transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={BRANDING.logo}
                  alt={BRANDING.name}
                  fill
                  sizes="(max-width: 640px) 40px, 48px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <span className="font-display font-bold text-lg sm:text-xl bg-academic-gradient bg-clip-text text-transparent">
                  {BRANDING.name}
                </span>
                <p className="text-xs text-muted-foreground font-accent">{BRANDING.tagline}</p>
              </div>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Admin Panel</span>
              </div>
              <Button variant="outline" onClick={handleLogout} size="sm" className="text-xs sm:text-sm">
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-on-scroll">
            <Card className="hover:shadow-elegant transition-all border-2">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold">{users.length}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Total Users</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add User Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  User Management
                </CardTitle>
                <Button
                  onClick={() => {
                    setShowAddForm(!showAddForm);
                    setError('');
                    setSuccess('');
                  }}
                  variant={showAddForm ? 'outline' : 'default'}
                >
                  {showAddForm ? (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showAddForm && (
                <form onSubmit={handleAddUser} className="space-y-4 mb-6 p-4 border rounded-lg bg-muted/50">
                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm">
                      {success}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm">Username</Label>
                      <input
                        id="username"
                        type="text"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        className="w-full px-3 sm:px-4 py-2 border-2 rounded-md bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                        placeholder="Enter username"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm">Password</Label>
                      <input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="w-full px-3 sm:px-4 py-2 border-2 rounded-md bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                        placeholder="Enter password"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm">Full Name</Label>
                      <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-3 sm:px-4 py-2 border-2 rounded-md bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full md:w-auto">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create User
                  </Button>
                </form>
              )}

              {/* Users List */}
              <div className="space-y-2">
                <h3 className="font-semibold mb-4">All Users ({users.length})</h3>
                {users.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No users found. Add your first user above.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{user.name}</span>
                            <Badge variant="outline">{user.username}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Created: {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

