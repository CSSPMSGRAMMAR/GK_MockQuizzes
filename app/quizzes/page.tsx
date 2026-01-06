'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { isUserLoggedIn, getCurrentUser, clearUserSession } from '@/lib/auth';
import { BRANDING } from '@/lib/branding';
import {
  BookOpen,
  Clock,
  Target,
  FileText,
  LogOut,
  Play,
  CheckCircle2,
  User,
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
  createdAt: string;
}

export default function QuizzesPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ username: string; name: string } | null>(null);

  useEffect(() => {
    // Check authentication
    if (!isUserLoggedIn()) {
      router.push('/login');
      return;
    }

    setUser(getCurrentUser());
    loadQuizzes();
  }, [router]);

  const loadQuizzes = async () => {
    try {
      const response = await fetch('/api/quizzes');
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data);
      }
    } catch (err) {
      console.error('Error loading quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearUserSession();
    router.push('/login');
  };

  const handleSelectQuiz = (quizId: string) => {
    router.push(`/quiz/${quizId}`);
  };

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
                <User className="h-4 w-4" />
                <span className="truncate max-w-[120px]">{user?.name}</span>
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
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-6 sm:mb-8 space-y-2 animate-on-scroll">
            <h2 className="text-2xl sm:text-3xl font-display font-bold bg-academic-gradient bg-clip-text text-transparent">Available Mock Papers</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Choose a mock test to practice for your PMS GK exam
            </p>
          </div>

          {/* Quizzes Grid */}
          {quizzes.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No mock papers available at the moment.</p>
                  <p className="text-sm mt-2">Please check back later.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {quizzes.map((quiz, index) => (
                <Card
                  key={quiz.id}
                  className="hover:shadow-elegant transition-all duration-300 hover:scale-[1.02] cursor-pointer border-2 hover:border-primary/50 group animate-on-scroll"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleSelectQuiz(quiz.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2 gap-2 flex-wrap">
                      <Badge variant="outline" className="bg-primary/10 text-xs">
                        Mock Paper
                      </Badge>
                      {quiz.available && (
                        <Badge variant="default" className="bg-green-600 text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Available
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg sm:text-xl line-clamp-2">{quiz.title}</CardTitle>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2 line-clamp-2">
                      {quiz.description}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Quiz Details */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">Questions:</span>
                        <span className="font-semibold">{quiz.totalQuestions}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">Marks:</span>
                        <span className="font-semibold">{quiz.totalMarks}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-semibold">{quiz.durationMinutes} min</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Negative:</span>
                        <span className="font-semibold text-red-600">
                          -{quiz.negativeMarking}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 transition-all group-hover:shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectQuiz(quiz.id);
                      }}
                    >
                      <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Start Mock Test
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Info Card */}
          <Card className="mt-8 border-blue-200 bg-blue-50 dark:bg-blue-950/20">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <BookOpen className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> Each mock paper is a complete practice test. You can
                  attempt multiple mock papers to improve your preparation. Your progress and
                  results are saved for each attempt.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

