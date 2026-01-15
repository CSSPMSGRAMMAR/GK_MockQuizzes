'use client';

import { useEffect, Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useExamStore } from '@/stores/examStore';
import { isUserLoggedIn } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle2,
  XCircle,
  Circle,
  Flag,
  Trophy,
  Clock,
  Target,
  TrendingUp,
  Home,
  RotateCcw,
  Download,
} from 'lucide-react';

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { result, isExamCompleted, questions, userAnswers, resetExam } = useExamStore();

  // Copy protection - prevent text selection, right-click, and keyboard shortcuts
  useEffect(() => {
    // Prevent right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Prevent copy shortcuts (Ctrl+C, Cmd+C, Ctrl+A, Cmd+A)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+C / Cmd+C
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        return false;
      }
      // Prevent Ctrl+A / Cmd+A (select all)
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        return false;
      }
      // Prevent Ctrl+X / Cmd+X (cut)
      if ((e.ctrlKey || e.metaKey) && e.key === 'x') {
        e.preventDefault();
        return false;
      }
      // Prevent Ctrl+V / Cmd+V (paste)
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        return false;
      }
      // Prevent Ctrl+S / Cmd+S (save)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        return false;
      }
      // Prevent F12 (developer tools)
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      // Prevent Ctrl+Shift+I / Cmd+Option+I (developer tools)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      // Prevent Ctrl+U / Cmd+U (view source)
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        return false;
      }
    };

    // Prevent text selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Prevent drag
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);

    // Add CSS class to body for additional protection
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    (document.body.style as any).mozUserSelect = 'none';
    (document.body.style as any).msUserSelect = 'none';

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      (document.body.style as any).mozUserSelect = '';
      (document.body.style as any).msUserSelect = '';
    };
  }, []);

  useEffect(() => {
    // Don't redirect if result exists - user is viewing results
    // Only redirect if there's absolutely no result after hydration
    if (!result) {
      // Give Zustand time to hydrate from localStorage
      const timeoutId = setTimeout(() => {
        // Re-check result from store after hydration
        const storeResult = useExamStore.getState().result;
        if (!storeResult) {
          // Only redirect if still no result after waiting
          router.push('/');
        }
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
    // If result exists, stay on page - don't redirect
  }, [result, router]);

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const handleRetakeExam = () => {
    resetExam();
    router.push('/');
  };

  const handleDownloadReport = () => {
    // In a real app, generate PDF report
    alert('Download report feature coming soon!');
  };

  return (
    <div 
      className="min-h-screen bg-background select-none" 
      style={{ 
        userSelect: 'none', 
        WebkitUserSelect: 'none', 
        MozUserSelect: 'none' as any, 
        msUserSelect: 'none' as any,
        WebkitTouchCallout: 'none' as any,
        KhtmlUserSelect: 'none' as any
      }}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onPaste={(e) => e.preventDefault()}
    >
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <h1 className="text-xl sm:text-2xl font-bold">Exam Results</h1>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Link href="/" className="flex-1 sm:flex-initial">
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <Home className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Home</span>
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleRetakeExam} className="flex-1 sm:flex-initial">
                <RotateCcw className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Retake</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
          {/* Result Banner */}
          <Card
            className={`border-2 ${
              result.isPassed
                ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                : 'border-red-500 bg-red-50 dark:bg-red-950/20'
            }`}
          >
            <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
              <div className="text-center space-y-3 sm:space-y-4">
                <div className="flex justify-center">
                  {result.isPassed ? (
                    <Trophy className="h-16 w-16 sm:h-20 sm:w-20 text-green-600" />
                  ) : (
                    <Target className="h-16 w-16 sm:h-20 sm:w-20 text-red-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                    {result.isPassed ? 'Congratulations!' : 'Keep Practicing!'}
                  </h2>
                  <p className="text-sm sm:text-lg text-muted-foreground px-2">
                    {result.isPassed
                      ? 'You have successfully passed the exam'
                      : 'You need more preparation to pass'}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-4 sm:mt-6">
                  <div className="text-center w-full sm:w-auto">
                    <div className="text-3xl sm:text-4xl font-bold">{result.obtainedMarks.toFixed(2)}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Marks Obtained</div>
                  </div>
                  <Separator orientation="vertical" className="h-12 sm:h-16 hidden sm:block" />
                  <Separator orientation="horizontal" className="w-full sm:hidden" />
                  <div className="text-center w-full sm:w-auto">
                    <div className="text-3xl sm:text-4xl font-bold">{result.percentage.toFixed(2)}%</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Percentage</div>
                  </div>
                  <Separator orientation="vertical" className="h-12 sm:h-16 hidden sm:block" />
                  <Separator orientation="horizontal" className="w-full sm:hidden" />
                  <div className="text-center w-full sm:w-auto">
                    <div className="text-3xl sm:text-4xl font-bold">{result.totalMarks}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Total Marks</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card>
              <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="p-2 sm:p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xl sm:text-2xl font-bold truncate">{result.correct}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Correct</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="p-2 sm:p-3 rounded-lg bg-red-100 dark:bg-red-900/30">
                    <XCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xl sm:text-2xl font-bold truncate">{result.incorrect}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Incorrect</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="p-2 sm:p-3 rounded-lg bg-muted">
                    <Circle className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xl sm:text-2xl font-bold truncate">{result.unattempted}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Unattempted</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="p-2 sm:p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                    <Flag className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xl sm:text-2xl font-bold truncate">{result.markedForReview}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Marked</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Card>
              <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm text-muted-foreground">Time Taken</div>
                    <div className="text-lg sm:text-xl font-semibold truncate">{formatTime(result.timeTaken)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <Target className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm text-muted-foreground">Accuracy</div>
                    <div className="text-lg sm:text-xl font-semibold">
                      {result.attempted > 0
                        ? ((result.correct / result.attempted) * 100).toFixed(2)
                        : 0}
                      %
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category-wise Performance */}
          <Card>
            <CardHeader className="px-3 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                Category-wise Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
              <div className="space-y-4 sm:space-y-6">
                {result.categoryWisePerformance.map((category) => (
                  <div key={category.category} className="space-y-2">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="text-xs">{category.category}</Badge>
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          {category.correct}/{category.total} correct
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-semibold">
                        {category.accuracy.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={category.accuracy} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Solutions (Optional) */}
          <Card>
            <CardHeader className="px-3 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="text-lg sm:text-xl">Detailed Solutions</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Review all questions with correct answers
              </p>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
              <div className="space-y-3 sm:space-y-4 overflow-hidden">
                {questions.map((question) => {
                  const answer = userAnswers.get(question.id);
                  const correctOption = question.options.find((opt) => opt.isCorrect);
                  const selectedOption = question.options.find(
                    (opt) => opt.id === answer?.selectedOptionId
                  );
                  const isCorrect = selectedOption?.isCorrect || false;
                  const wasAttempted = !!answer?.selectedOptionId;

                  return (
                    <div
                      key={question.id}
                      className={`p-3 sm:p-4 rounded-lg border-2 ${
                        !wasAttempted
                          ? 'border-muted bg-muted/20'
                          : isCorrect
                          ? 'border-green-200 bg-green-50 dark:bg-green-950/20'
                          : 'border-red-200 bg-red-50 dark:bg-red-950/20'
                      }`}
                      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="mt-1 flex-shrink-0">
                          {!wasAttempted ? (
                            <Circle className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                          ) : isCorrect ? (
                            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                          )}
                        </div>
                        <div className="flex-1 space-y-2 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              Q{question.questionNumber}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {question.category}
                            </Badge>
                          </div>
                          <p className="font-medium text-sm sm:text-base break-words">{question.question}</p>

                          {wasAttempted && !isCorrect && (
                            <div className="text-xs sm:text-sm">
                              <span className="text-red-600 font-medium">Your answer: </span>
                              <span className="text-red-600 break-words">{selectedOption?.text}</span>
                            </div>
                          )}

                          <div className="text-xs sm:text-sm">
                            <span className="text-green-600 font-medium">Correct answer: </span>
                            <span className="text-green-600 break-words">{correctOption?.text}</span>
                          </div>

                          {/* Explanation Section */}
                          {question.explanation ? (
                            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 rounded-r-lg">
                              <div className="flex items-start gap-2">
                                <div className="text-blue-600 dark:text-blue-400 font-semibold text-xs sm:text-sm">💡 Explanation:</div>
                              </div>
                              <p className="text-xs sm:text-sm text-foreground mt-2 leading-relaxed break-words">
                                {question.explanation}
                              </p>
                            </div>
                          ) : (
                            <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-muted/50 border-l-4 border-muted-foreground/30 rounded-r-lg">
                              <p className="text-xs text-muted-foreground italic">
                                No explanation available for this question.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button size="lg" onClick={handleRetakeExam} className="w-full sm:w-auto">
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake Exam
            </Button>
            <Button size="lg" variant="outline" onClick={handleDownloadReport} className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
            <Link href="/" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading results...</p>
        </div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
