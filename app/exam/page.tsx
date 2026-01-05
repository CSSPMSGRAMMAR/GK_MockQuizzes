'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useExamStore } from '@/stores/examStore';
import { ExamTimer } from '@/components/exam/ExamTimer';
import { QuestionCard } from '@/components/exam/QuestionCard';
import { QuestionNavigator } from '@/components/exam/QuestionNavigator';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Send, Menu } from 'lucide-react';

export default function ExamPage() {
  const router = useRouter();
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
  const [checkedAccess, setCheckedAccess] = useState(false);

  // Gate exam behind quiz login
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = window.localStorage.getItem('pmsgk.quizUser');
    if (!stored) {
      router.replace('/login?redirect=/exam');
      return;
    }

    setCheckedAccess(true);
  }, [router]);

  useEffect(() => {
    if (!checkedAccess) return;

    // Ensure questions are loaded (handles old persisted state)
    if (questions.length === 0) {
      initializeExam();
    }

    // Ensure exam is started once questions are ready
    if (!isExamStarted && !isExamCompleted) {
      startExam();
    }
  }, [
    checkedAccess,
    questions.length,
    isExamStarted,
    isExamCompleted,
    initializeExam,
    startExam,
  ]);

  useEffect(() => {
    if (isExamCompleted) {
      router.push('/result');
    }
  }, [isExamCompleted, router]);

  useEffect(() => {
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

  if (!checkedAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking quiz access…</p>
        </div>
      </div>
    );
  }

  if (!isExamStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold">PMS GK Test 2026</h1>
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <span>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ExamTimer />
              
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded"
              >
                <Menu className="h-5 w-5" />
              </button>
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
                  onClick={nextQuestion}
                  disabled={isLastQuestion}
                  className="flex-1 sm:flex-none"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>

                {isLastQuestion && (
                  <Button
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
            <div className="lg:hidden text-center text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>

          {/* Question Navigator - Desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <QuestionNavigator />
              
              <Button
                onClick={handleSubmit}
                className="w-full mt-4 bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Exam
              </Button>
            </div>
          </div>

          {/* Mobile Navigator */}
          {mobileNavOpen && (
            <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setMobileNavOpen(false)}>
              <div className="absolute right-0 top-0 h-full w-full sm:w-96 bg-white p-4 overflow-auto" onClick={(e) => e.stopPropagation()}>
                <QuestionNavigator />
                <Button
                  onClick={handleSubmit}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Exam
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Submit Confirmation Dialog */}
      {showSubmitDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Submit Exam?</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to submit your exam? You won't be able to change your
              answers after submission.
            </p>
            <div className="bg-gray-100 rounded-lg p-4 space-y-2 mb-6">
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
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowSubmitDialog(false)}
                className="flex-1"
              >
                Review Again
              </Button>
              <Button
                onClick={confirmSubmit}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Yes, Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

