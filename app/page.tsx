'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { isUserLoggedIn, getCurrentUser, clearUserSession } from '@/lib/auth';
import { motion } from 'framer-motion';
import { BRANDING } from '@/lib/branding';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnnouncementBanner } from '@/components/AnnouncementBanner';
import type { Announcement } from '@/lib/announcements';
import {
  BookOpen,
  Clock,
  Target,
  TrendingDown,
  Play,
  Lock,
  LogIn,
  LogOut,
  User,
  Sparkles,
  MessageCircle,
} from 'lucide-react';

interface Quiz {
  id: string;
  title: string;
  description: string;
  totalQuestions: number;
  totalMarks: number;
  durationMinutes: number;
  negativeMarking: number;
  passingPercentage: number;
  available: boolean;
  isPublic: boolean;
  createdAt: string;
}

export default function Home() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ username: string; name: string } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'free' | 'premium'>('free');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showMainContent, setShowMainContent] = useState(true);

  useEffect(() => {
    // Ensure this only runs on client
    setMounted(true);
    if (isUserLoggedIn()) {
      const currentUser = getCurrentUser();
      setUser(currentUser);
    }
    loadQuizzes();
    loadAnnouncements();
    
    // Track website visit (non-blocking with retry logic)
    const trackVisit = async (retries = 3) => {
      try {
        const response = await fetch('/api/analytics/visit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });
        
        if (!response.ok && retries > 0) {
          // Retry on failure
          setTimeout(() => trackVisit(retries - 1), 1000);
        }
      } catch (error) {
        // Silently fail - analytics shouldn't break the app
        if (retries > 0) {
          setTimeout(() => trackVisit(retries - 1), 1000);
        }
      }
    };
    
    trackVisit();
  }, []);

  const loadQuizzes = async () => {
    try {
      const response = await fetch('/api/quizzes');
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data);
      } else {
        // If API fails, set empty array to prevent infinite loading
        setQuizzes([]);
      }
    } catch (err) {
      console.error('Error loading quizzes:', err);
      // Set empty array on error to prevent infinite loading
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAnnouncements = async () => {
    try {
      const timestamp = Date.now();
      const response = await fetch(`/api/announcements?t=${timestamp}`, {
        cache: 'no-store',
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
        
        // Check if any announcement should hide other content
        const shouldHideContent = data.some(
          (ann: Announcement) => ann.isActive && ann.hideOtherContent
        );
        setShowMainContent(!shouldHideContent);
      }
    } catch (err) {
      console.error('Error loading announcements:', err);
    }
  };

  const handleAnnouncementDismiss = (id: string) => {
    // Check if dismissed announcement was hiding content
    const dismissedAnnouncement = announcements.find((a) => a.id === id);
    if (dismissedAnnouncement?.hideOtherContent) {
      // Check if any other active announcement still hides content
      const otherHidingAnnouncements = announcements.filter(
        (a) => a.id !== id && a.isActive && a.hideOtherContent
      );
      setShowMainContent(otherHidingAnnouncements.length === 0);
    }
  };

  const handleStartQuiz = (quizId: string, isPublic: boolean) => {
    if (!isPublic && !isUserLoggedIn()) {
      router.push('/login');
      return;
    }
    router.push(`/quiz/${quizId}`);
  };

  const handleLogout = () => {
    clearUserSession();
    setUser(null);
  };

  const publicQuizzes = quizzes.filter((q) => q.isPublic && q.available);
  const paidQuizzes = quizzes.filter((q) => !q.isPublic && q.available);

  // Show loading only while fetching quizzes
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background academic-hero relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-background to-primary/5"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>
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
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              {mounted && user ? (
                <>
                  <div className="hidden sm:flex items-center gap-2 text-sm">
                    <User className="h-4 w-4" />
                    <span className="truncate max-w-[100px]">{user.name}</span>
                  </div>
                  <Link href="/quizzes">
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                      My Quizzes
                    </Button>
                  </Link>
                  <Link href="/admin/login">
                    <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                      Admin
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="text-xs sm:text-sm">
                    <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button size="sm" className="text-xs sm:text-sm">
                      <LogIn className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/admin/login">
                    <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                      Admin
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 relative z-10">
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
          {/* Announcement Banner */}
          {announcements.length > 0 && (
            <AnnouncementBanner
              announcements={announcements}
              onDismiss={handleAnnouncementDismiss}
            />
          )}

          {/* Show/Hide Main Content Button (if announcement hides content) */}
          {!showMainContent && announcements.some((a) => a.isActive && a.hideOtherContent) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowMainContent(true)}
                className="shadow-elegant"
              >
                Show Quizzes & Content
              </Button>
            </motion.div>
          )}

          {/* Hero Section */}
          {showMainContent && (
            <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-3 sm:space-y-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center justify-center gap-2 mb-2"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </motion.div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold bg-academic-gradient bg-clip-text text-transparent">
                Welcome to PMS GK Quiz Platform
              </h2>
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </motion.div>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4"
            >
              Practice with our free demo quizzes or access premium mock tests to excel in your
              PMS General Knowledge exam preparation.
            </motion.p>
          </motion.div>

          {/* WhatsApp CTA Section - 20+ Mock Papers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative"
          >
            <Card className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 dark:from-green-950/20 dark:via-emerald-950/20 dark:to-green-950/20 border-2 border-green-200 dark:border-green-800 shadow-elegant overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/30 dark:bg-green-800/30 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-200/30 dark:bg-emerald-800/30 rounded-full blur-3xl -ml-16 -mb-16"></div>
              <CardContent className="pt-6 pb-6 relative z-10">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                      <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-full">
                        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-display font-bold text-green-900 dark:text-green-100">
                        Register Now for 20+ Full-Length Paid Mock Papers!
                      </h3>
                    </div>
                    <p className="text-sm sm:text-base text-green-800 dark:text-green-200">
                      Get access to our comprehensive collection of premium mock tests designed to help you excel in your PMS GK exam preparation.
                    </p>
                  </div>
                  {/* TODO: Replace 923001234567 with your actual WhatsApp number (format: country code + number without + or spaces) */}
                  <a
                    href="https://wa.me/923265511188?text=Hi!%20I%20want%20to%20register%20for%20the%2020%2B%20full-length%20paid%20mock%20papers%20test."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0"
                  >
                    <Button
                      size="lg"
                      className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto px-6 sm:px-8"
                    >
                      <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      <span className="font-semibold">Contact on WhatsApp</span>
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center gap-2 border-b"
          >
            <button
              onClick={() => setActiveTab('free')}
              className={`px-6 py-3 font-semibold transition-all relative ${
                activeTab === 'free'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Free Mock Tests
              {activeTab === 'free' && publicQuizzes.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {publicQuizzes.length}
                </Badge>
              )}
            </button>
            <button
              onClick={() => setActiveTab('premium')}
              className={`px-6 py-3 font-semibold transition-all relative ${
                activeTab === 'premium'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Premium Mock Tests
              {activeTab === 'premium' && paidQuizzes.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {paidQuizzes.length}
                </Badge>
              )}
            </button>
          </motion.div>

          {/* Free Mock Tests Tab */}
          {activeTab === 'free' && publicQuizzes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-xl sm:text-2xl font-display font-semibold">Free Mock Tests</h3>
                <Badge variant="secondary" className="text-xs sm:text-sm">
                  No Login Required
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {publicQuizzes.map((quiz, index) => (
                  <motion.div
                    key={quiz.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="hover:shadow-elegant transition-all duration-300 border-2 hover:border-primary/50 group h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base sm:text-lg line-clamp-2">{quiz.title}</CardTitle>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 shrink-0">
                          Free
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-2 line-clamp-2">{quiz.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                          <span className="truncate">{quiz.totalQuestions} Questions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                          <span>{quiz.durationMinutes} min</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                          <span>{quiz.totalMarks} Marks</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 shrink-0" />
                          <span>-{quiz.negativeMarking}</span>
                        </div>
                      </div>
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 transition-all group-hover:shadow-lg"
                        onClick={() => handleStartQuiz(quiz.id, true)}
                      >
                        <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Start Quiz
                      </Button>
                    </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Premium Mock Tests Tab */}
          {activeTab === 'premium' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-4"
            >
              {paidQuizzes.length > 0 ? (
                <>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-xl sm:text-2xl font-display font-semibold">Premium Mock Tests</h3>
                    <Badge variant="secondary" className="text-xs sm:text-sm">
                      Login Required
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {paidQuizzes.map((quiz, index) => (
                      <motion.div
                        key={quiz.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                    <Card className="hover:shadow-elegant transition-all duration-300 border-2 hover:border-primary/50 group h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base sm:text-lg line-clamp-2">{quiz.title}</CardTitle>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 shrink-0">
                          Premium
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-2 line-clamp-2">{quiz.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                          <span className="truncate">{quiz.totalQuestions} Questions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                          <span>{quiz.durationMinutes} min</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                          <span>{quiz.totalMarks} Marks</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 shrink-0" />
                          <span>-{quiz.negativeMarking}</span>
                        </div>
                      </div>
                      {mounted && isUserLoggedIn() && user ? (
                        <Button
                          className="w-full transition-all group-hover:shadow-lg"
                          onClick={() => handleStartQuiz(quiz.id, false)}
                        >
                          <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          Start Quiz
                        </Button>
                      ) : (
                        <Button
                          className="w-full transition-all"
                          variant="outline"
                          onClick={() => router.push('/login')}
                        >
                          <Lock className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          Login to Access
                        </Button>
                      )}
                    </CardContent>
                    </Card>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <Card className="border-2">
                  <CardContent className="pt-6">
                    <div className="text-center py-8 text-muted-foreground">
                      <Lock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="font-semibold mb-2">Premium Mock Tests</p>
                      <p className="text-sm">Login required to access premium mock tests.</p>
                      {!mounted || !isUserLoggedIn() ? (
                        <Button
                          className="mt-4"
                          onClick={() => router.push('/login')}
                        >
                          <LogIn className="h-4 w-4 mr-2" />
                          Login to Access
                        </Button>
                      ) : (
                        <p className="text-sm mt-2">No premium quizzes available at the moment.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="bg-muted/50 border-2">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <h3 className="font-display font-semibold text-lg sm:text-xl">About Our Quizzes</h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto px-4">
                  Our platform offers comprehensive PMS General Knowledge preparation with free demo
                  quizzes to get you started and premium mock tests for advanced practice. All
                  quizzes follow the official exam pattern with negative marking and time limits.
                </p>
              </div>
            </CardContent>
          </Card>
          </motion.div>
          </>
          )}
        </div>
      </main>
    </div>
  );
}
