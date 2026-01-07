import { NextRequest, NextResponse } from 'next/server';
import { trackVisit } from '@/lib/analytics';

// POST - Track a website visit
export async function POST(request: NextRequest) {
  try {
    await trackVisit();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking visit:', error);
    return NextResponse.json(
      { error: 'Failed to track visit' },
      { status: 500 }
    );
  }
}

