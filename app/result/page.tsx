'use client';

import { useEffect, Suspense } from 'react';
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

  useEffect(() => {
    // Check authentication
    if (!isUserLoggedIn()) {
      router.push('/login');
      return;
    }

    // Redirect if exam not completed
    if (!isExamCompleted || !result) {
      router.push('/');
    }
  }, [isExamCompleted, result, router]);

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Exam Results</h1>
            <div className="flex gap-2">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleRetakeExam}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Result Banner */}
          <Card
            className={`border-2 ${
              result.isPassed
                ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                : 'border-red-500 bg-red-50 dark:bg-red-950/20'
            }`}
          >
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  {result.isPassed ? (
                    <Trophy className="h-20 w-20 text-green-600" />
                  ) : (
                    <Target className="h-20 w-20 text-red-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    {result.isPassed ? 'Congratulations!' : 'Keep Practicing!'}
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    {result.isPassed
                      ? 'You have successfully passed the exam'
                      : 'You need more preparation to pass'}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-8 mt-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold">{result.obtainedMarks.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">Marks Obtained</div>
                  </div>
                  <Separator orientation="vertical" className="h-16" />
                  <div className="text-center">
                    <div className="text-4xl font-bold">{result.percentage.toFixed(2)}%</div>
                    <div className="text-sm text-muted-foreground">Percentage</div>
                  </div>
                  <Separator orientation="vertical" className="h-16" />
                  <div className="text-center">
                    <div className="text-4xl font-bold">{result.totalMarks}</div>
                    <div className="text-sm text-muted-foreground">Total Marks</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{result.correct}</div>
                    <div className="text-sm text-muted-foreground">Correct</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{result.incorrect}</div>
                    <div className="text-sm text-muted-foreground">Incorrect</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-muted">
                    <Circle className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{result.unattempted}</div>
                    <div className="text-sm text-muted-foreground">Unattempted</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                    <Flag className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{result.markedForReview}</div>
                    <div className="text-sm text-muted-foreground">Marked</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Clock className="h-8 w-8 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Time Taken</div>
                    <div className="text-xl font-semibold">{formatTime(result.timeTaken)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Target className="h-8 w-8 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                    <div className="text-xl font-semibold">
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
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Category-wise Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {result.categoryWisePerformance.map((category) => (
                  <div key={category.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{category.category}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {category.correct}/{category.total} correct
                        </span>
                      </div>
                      <span className="text-sm font-semibold">
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
            <CardHeader>
              <CardTitle>Detailed Solutions</CardTitle>
              <p className="text-sm text-muted-foreground">
                Review all questions with correct answers
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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
                      className={`p-4 rounded-lg border-2 ${
                        !wasAttempted
                          ? 'border-muted bg-muted/20'
                          : isCorrect
                          ? 'border-green-200 bg-green-50 dark:bg-green-950/20'
                          : 'border-red-200 bg-red-50 dark:bg-red-950/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {!wasAttempted ? (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          ) : isCorrect ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              Q{question.questionNumber}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {question.category}
                            </Badge>
                          </div>
                          <p className="font-medium">{question.question}</p>

                          {wasAttempted && !isCorrect && (
                            <div className="text-sm">
                              <span className="text-red-600 font-medium">Your answer: </span>
                              <span className="text-red-600">{selectedOption?.text}</span>
                            </div>
                          )}

                          <div className="text-sm">
                            <span className="text-green-600 font-medium">Correct answer: </span>
                            <span className="text-green-600">{correctOption?.text}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleRetakeExam}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake Exam
            </Button>
            <Button size="lg" variant="outline" onClick={handleDownloadReport}>
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
            <Link href="/">
              <Button size="lg" variant="outline">
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
