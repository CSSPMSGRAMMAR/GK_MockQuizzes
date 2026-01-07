import { NextResponse } from 'next/server';
import { getAnalyticsSummary } from '@/lib/analytics';

// GET - Get analytics summary for admin dashboard
export async function GET() {
  try {
    const summary = await getAnalyticsSummary();
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error getting analytics summary:', error);
    return NextResponse.json(
      { error: 'Failed to get analytics summary' },
      { status: 500 }
    );
  }
}

