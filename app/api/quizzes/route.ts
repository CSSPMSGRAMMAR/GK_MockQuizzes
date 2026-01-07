import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const QUIZZES_FILE = join(process.cwd(), 'data', 'quizzes.json');

// GET - Get all available quizzes
export async function GET() {
  try {
    if (!existsSync(QUIZZES_FILE)) {
      return NextResponse.json([]);
    }

    const quizzes = JSON.parse(readFileSync(QUIZZES_FILE, 'utf-8'));
    // Return only available quizzes
    const availableQuizzes = quizzes.filter((q: any) => q.available !== false);
    return NextResponse.json(availableQuizzes, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error reading quizzes:', error);
    return NextResponse.json(
      { error: 'Failed to load quizzes' },
      { status: 500 }
    );
  }
}

