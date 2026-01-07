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
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Activity,
  AlertTriangle,
} from 'lucide-react';

interface User {
  id: string;
  username: string;
  name: string;
  createdAt: string;
  totalAttempts?: number;
  quizAttempts?: Record<string, number>;
  lastAttemptAt?: string;
}

type SortField = 'name' | 'attempts' | 'created';
type SortOrder = 'asc' | 'desc';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('attempts');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAdmin()) {
      router.push('/admin/login');
      return;
    }
    loadUsers();
  }, [router]);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchQuery, sortField, sortOrder]);

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

  const filterAndSortUsers = () => {
    let filtered = [...users];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.username.toLowerCase().includes(query)
      );
    }

    // Sort users
    filtered.sort((a, b) => {
      let aValue: string | number = 0;
      let bValue: string | number = 0;

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'attempts':
          aValue = a.totalAttempts || 0;
          bValue = b.totalAttempts || 0;
          break;
        case 'created':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    setFilteredUsers(filtered);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
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

  const totalAttempts = users.reduce((sum, u) => sum + (u.totalAttempts || 0), 0);
  const activeUsers = users.filter((u) => (u.totalAttempts || 0) > 0).length;
  const highActivityUsers = users.filter((u) => (u.totalAttempts || 0) > 10).length;

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
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Simplified Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="hover:shadow-elegant transition-all border-2">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{users.length}</div>
                    <div className="text-sm text-muted-foreground">Total Users</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-elegant transition-all border-2">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-green-500/10">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{totalAttempts}</div>
                    <div className="text-sm text-muted-foreground">Quiz Attempts</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-elegant transition-all border-2">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-red-500/10">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{highActivityUsers}</div>
                    <div className="text-sm text-muted-foreground">High Activity ({'>'}10 attempts)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Management Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
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
                  size="sm"
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
            <CardContent className="space-y-4">
              {/* Add User Form */}
              {showAddForm && (
                <form onSubmit={handleAddUser} className="p-4 border rounded-lg bg-muted/50 space-y-4">
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
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full px-4 py-2 border-2 rounded-md bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
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
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-2 border-2 rounded-md bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
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
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border-2 rounded-md bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full sm:w-auto">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create User
                  </Button>
                </form>
              )}

              {/* Search and Sort Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search users by name or username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border-2 rounded-md bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                  />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <Button
                    variant={sortField === 'attempts' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSort('attempts')}
                    className="text-xs"
                  >
                    Attempts
                    {sortField === 'attempts' && (
                      sortOrder === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
                    )}
                  </Button>
                  <Button
                    variant={sortField === 'name' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSort('name')}
                    className="text-xs"
                  >
                    Name
                    {sortField === 'name' && (
                      sortOrder === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
                    )}
                  </Button>
                  <Button
                    variant={sortField === 'created' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSort('created')}
                    className="text-xs"
                  >
                    Created
                    {sortField === 'created' && (
                      sortOrder === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Users List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    Users ({filteredUsers.length}{searchQuery && ` of ${users.length}`})
                  </h3>
                </div>

                {filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchQuery ? 'No users found matching your search.' : 'No users found. Add your first user above.'}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredUsers.map((user) => {
                      const totalAttempts = user.totalAttempts || 0;
                      const quizAttempts = user.quizAttempts || {};
                      const isSuspicious = totalAttempts > 10;

                      return (
                        <div
                          key={user.id}
                          className={`p-4 border rounded-lg hover:bg-muted/50 transition-colors ${
                            isSuspicious ? 'border-red-300 dark:border-red-700 bg-red-50/50 dark:bg-red-950/20' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-2">
                                <span className="font-semibold">{user.name}</span>
                                <Badge variant="outline" className="text-xs">{user.username}</Badge>
                                {isSuspicious && (
                                  <Badge variant="destructive" className="text-xs">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    High Activity
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                                <span>Created: {new Date(user.createdAt).toLocaleDateString()}</span>
                                {user.lastAttemptAt && (
                                  <span>Last attempt: {new Date(user.lastAttemptAt).toLocaleDateString()}</span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-2xl font-bold text-primary">{totalAttempts}</div>
                                <div className="text-xs text-muted-foreground">Attempts</div>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Quiz Breakdown */}
                          {Object.keys(quizAttempts).length > 0 && (
                            <div className="mt-3 pt-3 border-t">
                              <div className="text-xs font-semibold text-muted-foreground mb-2">
                                Quiz Attempts:
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(quizAttempts)
                                  .sort(([, a], [, b]) => (b || 0) - (a || 0))
                                  .map(([quizId, count]) => (
                                    <Badge key={quizId} variant="secondary" className="text-xs">
                                      {quizId}: {count}
                                    </Badge>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
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
