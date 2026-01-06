import { NextRequest, NextResponse } from 'next/server';
import { validateAdminCredentials, ADMIN_USERNAME } from '@/lib/quizAccess';

// POST - Admin login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Check admin credentials using quiz access validation
    if (validateAdminCredentials(username, password)) {
      return NextResponse.json({ 
        success: true, 
        role: 'admin',
        username: ADMIN_USERNAME 
      });
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Error during admin login:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}

