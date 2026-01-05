// MCQ Exam Types for PMS GK Module

export interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface MCQuestion {
  id: string;
  questionNumber: number;
  category: string;
  question: string;
  options: MCQOption[];
  explanation?: string;
}

export interface UserAnswer {
  questionId: string;
  selectedOptionId: string | null;
  isMarkedForReview: boolean;
  timeSpent: number; // in seconds
}

export interface ExamConfig {
  id: string;
  title: string;
  description: string;
  totalQuestions: number;
  totalMarks: number;
  durationMinutes: number;
  negativeMarking: number; // e.g., 0.25 for -0.25 per wrong answer
  passingPercentage: number;
}

export interface ExamResult {
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  markedForReview: number;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  timeTaken: number; // in seconds
  isPassed: boolean;
  categoryWisePerformance: CategoryPerformance[];
}

export interface CategoryPerformance {
  category: string;
  total: number;
  correct: number;
  incorrect: number;
  accuracy: number;
}

export type QuestionStatus = 'unattempted' | 'attempted' | 'marked' | 'answered-marked';

export interface ExamState {
  config: ExamConfig;
  questions: MCQuestion[];
  userAnswers: Map<string, UserAnswer>;
  currentQuestionIndex: number;
  startTime: number | null;
  endTime: number | null;
  timeRemaining: number; // in seconds
  isExamStarted: boolean;
  isExamCompleted: boolean;
  result: ExamResult | null;
}



