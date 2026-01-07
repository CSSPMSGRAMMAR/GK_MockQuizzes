'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useExamStore } from '@/stores/examStore';
import { isUserLoggedIn, getCurrentUser } from '@/lib/auth';
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

function ExamPageContent() {
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
    currentQuizId,
  } = useExamStore();

  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    // Check if quiz is public and allow access
    const checkAccess = async () => {
      if (!quizId) {
        router.push('/');
        return;
      }

      // Load quiz info to check if it's public
      try {
        const response = await fetch('/api/quizzes');
        if (response.ok) {
          const quizzes = await response.json();
          const foundQuiz = quizzes.find((q: any) => q.id === quizId);
          
          if (!foundQuiz) {
            router.push('/');
            return;
          }

          // If quiz is not public, require login
          if (!foundQuiz.isPublic && !isUserLoggedIn()) {
            router.push('/login');
            return;
          }

          // Initialize exam with quiz ID if not already initialized for this quiz
          if (questions.length === 0 || currentQuizId !== quizId) {
            const examConfig = {
              id: foundQuiz.id,
              title: foundQuiz.title,
              description: foundQuiz.description,
              totalQuestions: foundQuiz.totalQuestions,
              totalMarks: foundQuiz.totalMarks,
              durationMinutes: foundQuiz.durationMinutes,
              negativeMarking: foundQuiz.negativeMarking,
              passingPercentage: foundQuiz.passingPercentage,
            };
            initializeExam(quizId, examConfig);
          }
        }
      } catch (err) {
        console.error('Error checking quiz access:', err);
        router.push('/');
      } finally {
        setCheckingAccess(false);
      }
    };

    checkAccess();
  }, [quizId, router, initializeExam, questions.length, currentQuizId]);

  useEffect(() => {
    // Start exam if not started and not completed and questions are loaded
    if (!checkingAccess && !isExamStarted && !isExamCompleted && questions.length > 0) {
      startExam();
    }
  }, [checkingAccess, isExamStarted, isExamCompleted, startExam, questions.length]);

  useEffect(() => {
    // Redirect to result if exam is completed
    // Add small delay to ensure result is saved to store
    if (isExamCompleted) {
      const timeoutId = setTimeout(() => {
        router.push('/result');
      }, 500); // Small delay to ensure state is persisted
      
      return () => clearTimeout(timeoutId);
    }
  }, [isExamCompleted, router]);

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

  const confirmSubmit = async () => {
    submitExam();
    setShowSubmitDialog(false);
    
    // Record quiz attempt (non-blocking)
    const currentUser = getCurrentUser();
    const quizIdToRecord = currentQuizId || quizId || 'unknown';
    
    if (currentUser?.id) {
      // Fire and forget - don't block submission
      fetch(`/api/users/${currentUser.id}/attempts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId: quizIdToRecord }),
      }).catch((error) => {
        console.error('Failed to record quiz attempt:', error);
      });
    }
    
    // Navigate to results
    router.push('/result');
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  if (checkingAccess || !isExamStarted || questions.length === 0) {
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
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                <h1 className="text-sm sm:text-lg font-semibold truncate">PMS GK Test 2026</h1>
              <div className="hidden md:flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <span>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <div className="hidden sm:block">
                <ExamTimer />
              </div>
              <div className="sm:hidden">
                <ExamTimer />
              </div>

              {/* Mobile Navigator Toggle */}
              <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
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
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Question Area */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            {currentQuestion && <QuestionCard question={currentQuestion} />}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
              <Button
                variant="outline"
                onClick={previousQuestion}
                disabled={isFirstQuestion}
                className="flex-1 sm:flex-none text-xs sm:text-sm"
                size="sm"
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </Button>

              <div className="flex gap-2 flex-1 sm:flex-none">
                {!isLastQuestion && (
                  <Button
                    variant="default"
                    onClick={nextQuestion}
                    className="flex-1 sm:flex-none text-xs sm:text-sm"
                    size="sm"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <span className="sm:hidden">Next</span>
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
                  </Button>
                )}

                {isLastQuestion && (
                  <Button
                    variant="default"
                    onClick={handleSubmit}
                    className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none text-xs sm:text-sm transition-all hover:shadow-lg"
                    size="sm"
                  >
                    <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Submit
                  </Button>
                )}
              </div>
            </div>

            {/* Mobile Question Counter */}
            <div className="lg:hidden text-center text-xs sm:text-sm text-muted-foreground">
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
                className="w-full mt-4 bg-green-600 hover:bg-green-700 transition-all hover:shadow-lg"
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

export default function ExamPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading exam...</p>
          </div>
        </div>
      }
    >
      <ExamPageContent />
    </Suspense>
  );
}
