import { NextRequest, NextResponse } from 'next/server';
import { readUsers, addUser, deleteUser, type User } from '@/lib/userStorage';

// Force dynamic rendering - no caching for admin routes
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

// GET - Get all users (admin only)
export async function GET(request: NextRequest) {
  try {
    const users = await readUsers();
    // Remove passwords from response
    const safeUsers = users.map(({ password, ...user }) => user);
    return NextResponse.json(safeUsers, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error reading users:', error);
    return NextResponse.json(
      { error: 'Failed to read users' },
      { status: 500 }
    );
  }
}

// POST - Create new user (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, name } = body;

    if (!username || !password || !name) {
      return NextResponse.json(
        { error: 'Username, password, and name are required' },
        { status: 400 }
      );
    }

    // Create new user
    const newUser: User = {
      id: `user${Date.now()}`,
      username,
      password, // In production, hash this!
      name,
      createdAt: new Date().toISOString(),
      totalAttempts: 0,
      quizAttempts: {},
    };

    await addUser(newUser);

    // Return user without password
    const { password: _, ...safeUser } = newUser;
    return NextResponse.json(safeUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// DELETE - Delete user (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await deleteUser(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}

