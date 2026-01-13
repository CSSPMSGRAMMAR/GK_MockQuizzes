import { MCQuestion } from '@/types/exam';
import { pmsGkMcqs } from '@/data/pms-gk-mcqs';
import { pmsGkMcqsAdditional } from '@/data/pms-gk-mcqs -1';
import { pmsGkMcqsAdvanced } from '@/data/pms-gk-mcqs-2';
import { pmsGkMockPaper2 } from '@/data/pms-gk-mock-paper-2';
import { pmsGkMockPaper3 } from '@/data/pms-gk-mock-paper-3';
import { pmsGkMockPaper4 } from '@/data/pms-gk-mock-paper-4';
import { pmsGkMockPaper5 } from '@/data/pms-gk-mock-paper-5';
import { pmsGkMockPaper6 } from '@/data/pms-gk-mock-paper-6';
import { pmsGkMockPaper7 } from '@/data/pms-gk-mock-paper-7';
import { pmsGkMockPaper8 } from '@/data/pms-gk-mock-paper-8';
import { pmsGkMockPaper9 } from '@/data/pms-gk-mock-paper-9';
import { pmsGkMockPaper10 } from '@/data/pms-gk-mock-paper-10';
import { pmsGkMockPaper11 } from '@/data/pms-gk-mock-paper-11';
import { pmsGkMockPaper12 } from '@/data/pms-gk-mock-paper-12';
import { pmsGkMockPaper13 } from '@/data/pms-gk-mock-paper-13';
import { pmsGkMockPaper14 } from '@/data/pms-gk-mock-paper-14';
import { pmsGkMockPaper15 } from '@/data/pms-gk-mock-paper-15';
import { pmsGkMockPaper16 } from '@/data/pms-gk-mock-paper-16';
// Subject-specific tests
import { pastPaper2021Questions } from '@/data/pastPaper2021';
import { geographyTestQuestions } from '@/data/geographyTest';
import { generalScienceComputerTestQuestions } from '@/data/generalScienceComputerTest';
import { currentAffairsTestQuestions } from '@/data/currentAffairsTest';
import { pakistanStudiesTestQuestions } from '@/data/pakistanStudiesTest';
import { islamiatTestQuestions } from '@/data/islamiatTest';

/**
 * Quiz loader utility to load questions from different sources
 * Maps quiz IDs to their question arrays
 */
const QUIZ_QUESTIONS_MAP: Record<string, MCQuestion[]> = {
  'pms-gk-demo-1': pmsGkMcqs, // Original 100 questions (q1-q100)
  'pms-gk-demo-2': pmsGkMcqsAdditional, // Additional 100 questions (q101-q200)
  'pms-gk-demo-3': pmsGkMcqsAdvanced, // Advanced 100 questions (q201-q300)
  'pms-gk-mock-paper-2': pmsGkMockPaper2, // Premium Mock Paper 2 with explanations (100 questions)
  'pms-gk-mock-paper-3': pmsGkMockPaper3, // Premium Mock Paper 3 with explanations (100 questions)
  'pms-gk-mock-paper-4': pmsGkMockPaper4, // Premium Mock Paper 4 with explanations (100 questions)
  'pms-gk-mock-paper-5': pmsGkMockPaper5, // Premium Mock Paper 5 with explanations (100 questions)
  'pms-gk-mock-paper-6': pmsGkMockPaper6, // Premium Mock Paper 6 with explanations (100 questions)
  'pms-gk-mock-paper-7': pmsGkMockPaper7, // Premium Mock Paper 7 with explanations (100 questions)
  'pms-gk-mock-paper-8': pmsGkMockPaper8, // Premium Mock Paper 8 with explanations (100 questions)
  'pms-gk-mock-paper-9': pmsGkMockPaper9, // Premium Mock Paper 9 with explanations (100 questions)
  'pms-gk-mock-paper-10': pmsGkMockPaper10, // Premium Mock Paper 10 with explanations (99 questions)
  'pms-gk-mock-paper-11': pmsGkMockPaper11, // Premium Mock Paper 11 with explanations (100 questions)
  'pms-gk-mock-paper-12': pmsGkMockPaper12, // Premium Mock Paper 12 with explanations (20 questions)
  'pms-gk-mock-paper-13': pmsGkMockPaper13, // Premium Mock Paper 13 with explanations (100 questions)
  'pms-gk-mock-paper-14': pmsGkMockPaper14, // Premium Mock Paper 14 with explanations (100 questions)
  'pms-gk-mock-paper-15': pmsGkMockPaper15, // Premium Mock Paper 15 with explanations (100 questions)
  'pms-gk-mock-paper-16': pmsGkMockPaper16, // Premium Mock Paper 16 with explanations (100 questions)
  // Subject-specific tests
  'past-paper-2021': pastPaper2021Questions, // Past Paper 2021 (100 questions)
  'geography-test': geographyTestQuestions, // Geography Test (100 questions)
  'general-science-computer-test': generalScienceComputerTestQuestions, // General Science and Computer Test (100 questions)
  'current-affairs-test': currentAffairsTestQuestions, // Current Affairs Test (100 questions)
  'pakistan-studies-test': pakistanStudiesTestQuestions, // Pakistan Studies Test (100 questions)
  'islamiat-test': islamiatTestQuestions, // Islamiat Test (100 questions)
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


