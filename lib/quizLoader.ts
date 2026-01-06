import { MCQuestion } from '@/types/exam';
import { pmsGkMcqs } from '@/data/pms-gk-mcqs';
import { pmsGkMcqsAdditional } from '@/data/pms-gk-mcqs -1';
import { pmsGkMcqsAdvanced } from '@/data/pms-gk-mcqs-2';

/**
 * Quiz loader utility to load questions from different sources
 * Maps quiz IDs to their question arrays
 */
const QUIZ_QUESTIONS_MAP: Record<string, MCQuestion[]> = {
  'pms-gk-demo-1': pmsGkMcqs, // Original 100 questions (q1-q100)
  'pms-gk-demo-2': pmsGkMcqsAdditional, // Additional 100 questions (q101-q200)
  'pms-gk-demo-3': pmsGkMcqsAdvanced, // Advanced 100 questions (q201-q300)
};

/**
 * Get questions for a specific quiz ID
 * @param quizId - The ID of the quiz
 * @returns Array of MCQuestions for the quiz, or empty array if not found
 */
export function getQuizQuestions(quizId: string): MCQuestion[] {
  return QUIZ_QUESTIONS_MAP[quizId] || [];
}

/**
 * Get all available quiz IDs
 * @returns Array of quiz IDs
 */
export function getAvailableQuizIds(): string[] {
  return Object.keys(QUIZ_QUESTIONS_MAP);
}

/**
 * Check if a quiz ID exists
 * @param quizId - The ID of the quiz to check
 * @returns True if quiz exists, false otherwise
 */
export function quizExists(quizId: string): boolean {
  return quizId in QUIZ_QUESTIONS_MAP;
}


