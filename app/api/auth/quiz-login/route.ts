import { NextResponse } from 'next/server';
import { validateQuizUser } from '@/lib/quizAccess';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body ?? {};

    if (!username || !password) {
      return NextResponse.json(
        { error: 'username and password are required' },
        { status: 400 }
      );
    }

    const isValid = await validateQuizUser(String(username), String(password));

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // In a real app you would issue a signed token here.
    return NextResponse.json({
      success: true,
      username,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unexpected error' },
      { status: 500 }
    );
  }
}


