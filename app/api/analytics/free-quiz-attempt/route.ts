import { NextRequest, NextResponse } from 'next/server';
import { trackFreeQuizAttempt } from '@/lib/analytics';

// POST - Track a free quiz attempt
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quizId } = body;

    if (!quizId) {
      return NextResponse.json(
        { error: 'Quiz ID is required' },
        { status: 400 }
      );
    }

    await trackFreeQuizAttempt(quizId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking free quiz attempt:', error);
    return NextResponse.json(
      { error: 'Failed to track free quiz attempt' },
      { status: 500 }
    );
  }
}

