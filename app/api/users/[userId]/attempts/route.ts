import { NextRequest, NextResponse } from 'next/server';
import { recordQuizAttempt } from '@/lib/userStorage';

// POST - Record a quiz attempt for a user
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const body = await request.json();
    const { quizId } = body;

    if (!quizId) {
      return NextResponse.json(
        { error: 'Quiz ID is required' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await recordQuizAttempt(userId, quizId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording quiz attempt:', error);
    return NextResponse.json(
      { error: 'Failed to record quiz attempt' },
      { status: 500 }
    );
  }
}


