'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { isUserLoggedIn, getCurrentUser, clearUserSession } from '@/lib/auth';
import {
  BookOpen,
  Clock,
  Target,
  FileText,
  LogOut,
  Play,
  CheckCircle2,
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">PMS GK Mock Tests</h1>
              <p className="text-sm text-muted-foreground">
                Welcome, {user?.name} • Select a mock paper to begin
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 space-y-2">
            <h2 className="text-3xl font-display font-bold">Available Mock Papers</h2>
            <p className="text-muted-foreground">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <Card
                  key={quiz.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50"
                  onClick={() => handleSelectQuiz(quiz.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="bg-primary/10">
                        Mock Paper
                      </Badge>
                      {quiz.available && (
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Available
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">{quiz.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                      {quiz.description}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Quiz Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Questions:</span>
                        <span className="font-semibold">{quiz.totalQuestions}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Marks:</span>
                        <span className="font-semibold">{quiz.totalMarks}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
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
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectQuiz(quiz.id);
                      }}
                    >
                      <Play className="h-4 w-4 mr-2" />
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

