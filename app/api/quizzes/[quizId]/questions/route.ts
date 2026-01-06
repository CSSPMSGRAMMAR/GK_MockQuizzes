import { NextRequest, NextResponse } from 'next/server';
import { getQuizQuestions } from '@/lib/quizLoader';

/**
 * GET /api/quizzes/[quizId]/questions
 * Get questions for a specific quiz
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { quizId: string } }
) {
  try {
    const { quizId } = params;

    if (!quizId) {
      return NextResponse.json(
        { error: 'Quiz ID is required' },
        { status: 400 }
      );
    }

    const questions = getQuizQuestions(quizId);

    if (questions.length === 0) {
      return NextResponse.json(
        { error: 'Quiz not found or has no questions' },
        { status: 404 }
      );
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz questions' },
      { status: 500 }
    );
  }
}


