import { NextRequest, NextResponse } from 'next/server';
import { trackVisit } from '@/lib/analytics';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

// POST - Track a website visit
export async function POST(request: NextRequest) {
  try {
    // Track visit (non-blocking, errors are handled internally)
    await trackVisit();
    
    // Always return success to prevent client-side errors
    // Analytics failures shouldn't break the user experience
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
    console.error('Error in visit tracking API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track visit' },
      {
        status: 200, // Return 200 to prevent client-side errors
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  }
}


