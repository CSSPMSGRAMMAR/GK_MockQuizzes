'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useExamStore } from '@/stores/examStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
} from 'lucide-react';

export default function ResultPage() {
  const router = useRouter();
  const { result, isExamCompleted, questions, userAnswers, resetExam } = useExamStore();

  useEffect(() => {
    if (!isExamCompleted || !result) {
      router.push('/');
    }
  }, [isExamCompleted, result, router]);

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading results...</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
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
                ? 'border-green-500 bg-green-50'
                : 'border-red-500 bg-red-50'
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
                  <p className="text-lg text-gray-600">
                    {result.isPassed
                      ? 'You have successfully passed the exam'
                      : 'You need more preparation to pass'}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-8 mt-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold">{result.obtainedMarks.toFixed(2)}</div>
                    <div className="text-sm text-gray-600">Marks Obtained</div>
                  </div>
                  <div className="border-l h-16"></div>
                  <div className="text-center">
                    <div className="text-4xl font-bold">{result.percentage.toFixed(2)}%</div>
                    <div className="text-sm text-gray-600">Percentage</div>
                  </div>
                  <div className="border-l h-16"></div>
                  <div className="text-center">
                    <div className="text-4xl font-bold">{result.totalMarks}</div>
                    <div className="text-sm text-gray-600">Total Marks</div>
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
                  <div className="p-3 rounded-lg bg-green-100">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{result.correct}</div>
                    <div className="text-sm text-gray-600">Correct</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-red-100">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{result.incorrect}</div>
                    <div className="text-sm text-gray-600">Incorrect</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-gray-200">
                    <Circle className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{result.unattempted}</div>
                    <div className="text-sm text-gray-600">Unattempted</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-yellow-100">
                    <Flag className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{result.markedForReview}</div>
                    <div className="text-sm text-gray-600">Marked</div>
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
                  <Clock className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">Time Taken</div>
                    <div className="text-xl font-semibold">{formatTime(result.timeTaken)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Target className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">Accuracy</div>
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
                        <span className="text-sm text-gray-600">
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleRetakeExam}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake Exam
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

