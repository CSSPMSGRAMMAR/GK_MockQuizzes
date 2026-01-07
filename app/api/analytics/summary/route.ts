import { NextResponse } from 'next/server';
import { getAnalyticsSummary } from '@/lib/analytics';

// GET - Get analytics summary for admin dashboard
export async function GET() {
  try {
    const summary = await getAnalyticsSummary();
    return NextResponse.json(summary, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error getting analytics summary:', error);
    // Return default values instead of error to prevent dashboard breakage
    return NextResponse.json(
      {
        currentVisitors: 0,
        totalVisits: 0,
        totalFreeQuizAttempts: 0,
        freeQuizAttemptsByQuiz: {},
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  }
}


