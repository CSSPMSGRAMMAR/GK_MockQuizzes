'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useExamStore } from '@/stores/examStore';
import { isUserLoggedIn } from '@/lib/auth';
import { ExamTimer } from '@/components/exam/ExamTimer';
import { QuestionCard } from '@/components/exam/QuestionCard';
import { QuestionNavigator } from '@/components/exam/QuestionNavigator';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ChevronLeft, ChevronRight, Send, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function ExamPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizId = searchParams.get('quiz');
  const {
    questions,
    currentQuestionIndex,
    isExamStarted,
    isExamCompleted,
    nextQuestion,
    previousQuestion,
    submitExam,
    initializeExam,
    startExam,
  } = useExamStore();

  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [quizTitle, setQuizTitle] = useState('PMS GK Test');

  useEffect(() => {
    // Check authentication
    if (!isUserLoggedIn()) {
      router.push('/login');
      return;
    }

    // Load quiz title if quizId is provided
    if (quizId) {
      fetch(`/api/quizzes`)
        .then((res) => res.json())
        .then((quizzes) => {
          const quiz = quizzes.find((q: any) => q.id === quizId);
          if (quiz) {
            setQuizTitle(quiz.title);
          }
        })
        .catch(() => {
          // Ignore errors
        });
    }

    // Initialize exam if not started
    if (!isExamStarted && !isExamCompleted) {
      initializeExam();
    }
  }, [isExamStarted, isExamCompleted, initializeExam, router, quizId]);

  useEffect(() => {
    // Redirect to result if exam is completed
    if (isExamCompleted) {
      router.push(`/result?quiz=${quizId || ''}`);
    }
  }, [isExamCompleted, router, quizId]);

  useEffect(() => {
    // Prevent accidental page refresh
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isExamStarted && !isExamCompleted) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isExamStarted, isExamCompleted]);

  const handleSubmit = () => {
    setShowSubmitDialog(true);
  };

  const confirmSubmit = () => {
    submitExam();
    setShowSubmitDialog(false);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  if (!isExamStarted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading exam...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Minimal and Distraction-Free */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold">{quizTitle}</h1>
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <span>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ExamTimer />
              
              {/* Mobile Navigator Toggle */}
              <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="outline" size="sm">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-96">
                  <QuestionNavigator />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Area */}
          <div className="lg:col-span-3 space-y-6">
            {currentQuestion && <QuestionCard question={currentQuestion} />}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="outline"
                onClick={previousQuestion}
                disabled={isFirstQuestion}
                className="flex-1 sm:flex-none"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="default"
                  onClick={nextQuestion}
                  disabled={isLastQuestion}
                  className="flex-1 sm:flex-none"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>

                {isLastQuestion && (
                  <Button
                    variant="default"
                    onClick={handleSubmit}
                    className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit
                  </Button>
                )}
              </div>
            </div>

            {/* Mobile Question Counter */}
            <div className="lg:hidden text-center text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>

          {/* Question Navigator - Desktop Only */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <QuestionNavigator />
              
              <Button
                variant="default"
                onClick={handleSubmit}
                className="w-full mt-4 bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Exam
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit your exam? You won't be able to change your
              answers after submission.
              <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Questions:</span>
                  <span className="font-semibold">{questions.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Answered:</span>
                  <span className="font-semibold text-green-600">
                    {
                      questions.filter(
                        (q) => useExamStore.getState().userAnswers.get(q.id)?.selectedOptionId
                      ).length
                    }
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Not Answered:</span>
                  <span className="font-semibold text-red-600">
                    {
                      questions.filter(
                        (q) => !useExamStore.getState().userAnswers.get(q.id)?.selectedOptionId
                      ).length
                    }
                  </span>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Review Again</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmSubmit}
              className="bg-green-600 hover:bg-green-700"
            >
              Yes, Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
