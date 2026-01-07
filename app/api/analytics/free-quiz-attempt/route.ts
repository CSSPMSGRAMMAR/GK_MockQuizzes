import { NextRequest, NextResponse } from 'next/server';
import { trackFreeQuizAttempt } from '@/lib/analytics';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

// POST - Track a free quiz attempt
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quizId } = body;

    if (!quizId) {
      return NextResponse.json(
        { success: false, error: 'Quiz ID is required' },
        { 
          status: 200, // Return 200 to prevent client-side errors
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        }
      );
    }

    // Track attempt (non-blocking, errors are handled internally)
    await trackFreeQuizAttempt(quizId);
    
    return NextResponse.json(
      { success: true },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    // Log error but still return success
    console.error('Error in free quiz attempt tracking API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track free quiz attempt' },
      {
        status: 200, // Return 200 to prevent client-side errors
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  }
}


