import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  MCQuestion,
  UserAnswer,
  ExamConfig,
  ExamResult,
  QuestionStatus,
  CategoryPerformance,
} from '@/types/exam';
import { pmsGkMcqs } from '@/data/pms-gk-mcqs';

interface ExamStore {
  // State
  config: ExamConfig;
  questions: MCQuestion[];
  userAnswers: Map<string, UserAnswer>;
  currentQuestionIndex: number;
  startTime: number | null;
  endTime: number | null;
  timeRemaining: number;
  isExamStarted: boolean;
  isExamCompleted: boolean;
  result: ExamResult | null;

  // Actions
  initializeExam: () => void;
  startExam: () => void;
  selectAnswer: (questionId: string, optionId: string) => void;
  clearAnswer: (questionId: string) => void;
  toggleMarkForReview: (questionId: string) => void;
  navigateToQuestion: (index: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  submitExam: () => void;
  resetExam: () => void;
  updateTimer: (seconds: number) => void;
  getQuestionStatus: (questionId: string) => QuestionStatus;
  calculateResult: () => ExamResult;
}

const defaultConfig: ExamConfig = {
  id: 'pms-gk-2026',
  title: 'PMS Punjab General Knowledge Test 2026',
  description: 'Complete 100 MCQs test for PMS GK preparation',
  totalQuestions: 100,
  totalMarks: 100,
  durationMinutes: 120, // 2 hours
  negativeMarking: 0.25,
  passingPercentage: 50,
};

export const useExamStore = create<ExamStore>()(
  persist(
    (set, get) => ({
      // Initial State
      config: defaultConfig,
      questions: [],
      userAnswers: new Map(),
      currentQuestionIndex: 0,
      startTime: null,
      endTime: null,
      timeRemaining: defaultConfig.durationMinutes * 60, // in seconds
      isExamStarted: false,
      isExamCompleted: false,
      result: null,

      // Initialize exam with questions
      initializeExam: () => {
        set({
          questions: pmsGkMcqs,
          userAnswers: new Map(),
          currentQuestionIndex: 0,
          startTime: null,
          endTime: null,
          timeRemaining: defaultConfig.durationMinutes * 60,
          isExamStarted: false,
          isExamCompleted: false,
          result: null,
        });
      },

      // Start the exam
      startExam: () => {
        const now = Date.now();
        set({
          isExamStarted: true,
          startTime: now,
          timeRemaining: defaultConfig.durationMinutes * 60,
        });
      },

      // Select an answer for a question
      selectAnswer: (questionId: string, optionId: string) => {
        const { userAnswers } = get();
        const newAnswers = new Map(userAnswers);
        
        const existingAnswer = newAnswers.get(questionId);
        newAnswers.set(questionId, {
          questionId,
          selectedOptionId: optionId,
          isMarkedForReview: existingAnswer?.isMarkedForReview || false,
          timeSpent: existingAnswer?.timeSpent || 0,
        });

        set({ userAnswers: newAnswers });
      },

      // Clear answer for a question
      clearAnswer: (questionId: string) => {
        const { userAnswers } = get();
        const newAnswers = new Map(userAnswers);
        
        const existingAnswer = newAnswers.get(questionId);
        if (existingAnswer) {
          newAnswers.set(questionId, {
            ...existingAnswer,
            selectedOptionId: null,
          });
        }

        set({ userAnswers: newAnswers });
      },

      // Toggle mark for review
      toggleMarkForReview: (questionId: string) => {
        const { userAnswers } = get();
        const newAnswers = new Map(userAnswers);
        
        const existingAnswer = newAnswers.get(questionId);
        newAnswers.set(questionId, {
          questionId,
          selectedOptionId: existingAnswer?.selectedOptionId || null,
          isMarkedForReview: !existingAnswer?.isMarkedForReview,
          timeSpent: existingAnswer?.timeSpent || 0,
        });

        set({ userAnswers: newAnswers });
      },

      // Navigate to specific question
      navigateToQuestion: (index: number) => {
        const { questions } = get();
        if (index >= 0 && index < questions.length) {
          set({ currentQuestionIndex: index });
        }
      },

      // Navigate to next question
      nextQuestion: () => {
        const { currentQuestionIndex, questions } = get();
        if (currentQuestionIndex < questions.length - 1) {
          set({ currentQuestionIndex: currentQuestionIndex + 1 });
        }
      },

      // Navigate to previous question
      previousQuestion: () => {
        const { currentQuestionIndex } = get();
        if (currentQuestionIndex > 0) {
          set({ currentQuestionIndex: currentQuestionIndex - 1 });
        }
      },

      // Update timer
      updateTimer: (seconds: number) => {
        set({ timeRemaining: seconds });
        
        // Auto-submit when time runs out
        if (seconds <= 0) {
          get().submitExam();
        }
      },

      // Get question status
      getQuestionStatus: (questionId: string): QuestionStatus => {
        const { userAnswers } = get();
        const answer = userAnswers.get(questionId);

        if (!answer) return 'unattempted';

        if (answer.selectedOptionId && answer.isMarkedForReview) {
          return 'answered-marked';
        }

        if (answer.selectedOptionId) {
          return 'attempted';
        }

        if (answer.isMarkedForReview) {
          return 'marked';
        }

        return 'unattempted';
      },

      // Calculate result
      calculateResult: (): ExamResult => {
        const { questions, userAnswers, config } = get();
        
        let correct = 0;
        let incorrect = 0;
        let attempted = 0;
        let markedForReview = 0;

        const categoryStats = new Map<string, { total: number; correct: number; incorrect: number }>();

        questions.forEach((question) => {
          const answer = userAnswers.get(question.id);
          
          // Initialize category stats
          if (!categoryStats.has(question.category)) {
            categoryStats.set(question.category, { total: 0, correct: 0, incorrect: 0 });
          }
          const catStat = categoryStats.get(question.category)!;
          catStat.total++;

          if (answer?.isMarkedForReview) {
            markedForReview++;
          }

          if (answer?.selectedOptionId) {
            attempted++;
            const correctOption = question.options.find((opt) => opt.isCorrect);
            
            if (correctOption?.id === answer.selectedOptionId) {
              correct++;
              catStat.correct++;
            } else {
              incorrect++;
              catStat.incorrect++;
            }
          }
        });

        const unattempted = questions.length - attempted;
        
        // Calculate marks: +1 for correct, -0.25 for incorrect
        const obtainedMarks = correct - (incorrect * config.negativeMarking);
        const percentage = (obtainedMarks / config.totalMarks) * 100;
        const isPassed = percentage >= config.passingPercentage;

        // Build category-wise performance
        const categoryWisePerformance: CategoryPerformance[] = Array.from(categoryStats.entries()).map(
          ([category, stats]) => ({
            category,
            total: stats.total,
            correct: stats.correct,
            incorrect: stats.incorrect,
            accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
          })
        );

        const { startTime } = get();
        const timeTaken = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

        return {
          totalQuestions: questions.length,
          attempted,
          correct,
          incorrect,
          unattempted,
          markedForReview,
          totalMarks: config.totalMarks,
          obtainedMarks: Math.max(0, obtainedMarks), // Don't allow negative marks
          percentage: Math.max(0, percentage),
          timeTaken,
          isPassed,
          categoryWisePerformance,
        };
      },

      // Submit exam
      submitExam: () => {
        const result = get().calculateResult();
        const now = Date.now();
        
        set({
          isExamCompleted: true,
          endTime: now,
          result,
        });
      },

      // Reset exam
      resetExam: () => {
        get().initializeExam();
      },
    }),
    {
      name: 'pms-gk-exam-storage',
      // Only persist certain fields
      partialize: (state) => ({
        userAnswers: Array.from(state.userAnswers.entries()),
        currentQuestionIndex: state.currentQuestionIndex,
        startTime: state.startTime,
        timeRemaining: state.timeRemaining,
        isExamStarted: state.isExamStarted,
        isExamCompleted: state.isExamCompleted,
        result: state.result,
      }),
      // Rehydrate Map from array
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.userAnswers)) {
          state.userAnswers = new Map(state.userAnswers as any);
        }
      },
    }
  )
);

