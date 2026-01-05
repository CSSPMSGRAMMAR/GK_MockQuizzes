'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useExamStore } from '@/stores/examStore';
import { isUserLoggedIn, getCurrentUser, clearUserSession } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  AlertCircle,
  BookOpen,
  Clock,
  FileText,
  Target,
  TrendingDown,
  CheckCircle2,
  XCircle,
  Flag,
  Circle,
  Play,
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { config, initializeExam, startExam } = useExamStore();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [user, setUser] = useState<{ username: string; name: string } | null>(null);

  useEffect(() => {
    // Check if user is logged in
    if (!isUserLoggedIn()) {
      router.push('/login');
      return;
    }
    setUser(getCurrentUser());
  }, [router]);

  const handleStartExam = () => {
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    initializeExam();
    startExam();
    router.push('/exam');
  };

  const handleLogout = () => {
    clearUserSession();
    router.push('/login');
  };

  if (!user) {
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
    <div className="min-h-screen bg-background">
      {/* Header with user info */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">PMS GK Quiz</h1>
              <p className="text-sm text-muted-foreground">
                Welcome, {user.name}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin/login">
                <button className="text-sm text-muted-foreground hover:text-foreground">
                  Admin
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-display font-bold">{config.title}</h1>
            <p className="text-lg text-muted-foreground">{config.description}</p>
          </div>

          {/* Exam Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Exam Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total Questions</div>
                    <div className="text-2xl font-bold">{config.totalQuestions}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total Marks</div>
                    <div className="text-2xl font-bold">{config.totalMarks}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Duration</div>
                    <div className="text-2xl font-bold">{config.durationMinutes} minutes</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30">
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Negative Marking</div>
                    <div className="text-2xl font-bold">-{config.negativeMarking}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Important Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">General Instructions:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      The test consists of <strong>{config.totalQuestions} multiple-choice questions</strong>.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      Total duration is <strong>{config.durationMinutes} minutes</strong>. The timer will start as soon as you begin the test.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      Each correct answer carries <strong>1 mark</strong>.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600">•</span>
                    <span className="text-red-600">
                      <strong>Negative marking:</strong> {config.negativeMarking} marks will be deducted for each wrong answer.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      Unattempted questions will carry <strong>0 marks</strong>.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      You can navigate between questions using the question palette or Previous/Next buttons.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      You can mark questions for review and come back to them later.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      The exam will auto-submit when time expires.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      Make sure you have a stable internet connection throughout the test.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      Do not refresh the page during the exam as your progress is automatically saved.
                    </span>
                  </li>
                </ul>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Question Status Legend:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-green-500 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Answered</div>
                      <div className="text-xs text-muted-foreground">
                        You have selected an answer
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                      <Circle className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Not Answered</div>
                      <div className="text-xs text-muted-foreground">
                        Question not attempted yet
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-yellow-500 flex items-center justify-center">
                      <Flag className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Marked for Review</div>
                      <div className="text-xs text-muted-foreground">
                        Question marked to review later
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-purple-500 flex items-center justify-center">
                      <AlertCircle className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Answered & Marked</div>
                      <div className="text-xs text-muted-foreground">
                        Answered but marked for review
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Scoring System:</h3>
                <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Correct Answer:</span>
                    <Badge variant="default" className="bg-green-600">+1 Mark</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Wrong Answer:</span>
                    <Badge variant="destructive">-{config.negativeMarking} Mark</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Unattempted:</span>
                    <Badge variant="outline">0 Mark</Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Passing Percentage:</span>
                    <span>{config.passingPercentage}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms and Conditions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                />
                <label htmlFor="terms" className="text-sm cursor-pointer">
                  I have read and understood all the instructions. I agree to abide by the rules
                  and regulations of this examination. I understand that any violation may result
                  in disqualification.
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleStartExam}
              disabled={!agreedToTerms}
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Exam
            </Button>
          </div>

          {/* Warning */}
          <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Important:</strong> Once you start the exam, the timer will begin
                  immediately. Make sure you are in a quiet environment with a stable internet
                  connection. You cannot pause the exam once started.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
