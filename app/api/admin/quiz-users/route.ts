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
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unexpected error' },
      { status: 500 }
    );
  }
}

