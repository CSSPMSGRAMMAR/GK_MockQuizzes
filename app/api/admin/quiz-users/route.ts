import { NextResponse } from 'next/server';
import {
  addQuizUser,
  getQuizUsers,
  validateAdminCredentials,
  ADMIN_USERNAME,
} from '@/lib/quizAccess';

export async function GET() {
  // Simple listing endpoint for debugging / admin use.
  const users = (await getQuizUsers()).map((u) => ({ username: u.username }));
  return NextResponse.json({ users, adminUsername: ADMIN_USERNAME });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, adminUsername, adminPassword } = body ?? {};

    if (!adminUsername || !adminPassword || !validateAdminCredentials(adminUsername, adminPassword)) {
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
    }

    if (!username || !password) {
      return NextResponse.json(
        { error: 'username and password are required' },
        { status: 400 }
      );
    }

    const user = await addQuizUser(String(username), String(password));

    return NextResponse.json(
      {
        message: 'Quiz user added successfully',
        user: { username: user.username },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding quiz user:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unexpected error';
    
    // Provide more helpful error messages
    if (errorMessage.includes('Redis') || errorMessage.includes('connection')) {
      return NextResponse.json(
        { 
          error: 'Database connection error. Please check Redis configuration.',
          details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

