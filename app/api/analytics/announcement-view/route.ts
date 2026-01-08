import { NextRequest, NextResponse } from 'next/server';
import { trackAnnouncementView } from '@/lib/analytics';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

// POST - Track an announcement view
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { announcementId } = body;

    if (!announcementId || typeof announcementId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid announcementId' },
        {
          status: 400,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        }
      );
    }

    // Track announcement view (non-blocking, errors are handled internally)
    await trackAnnouncementView(announcementId);
    
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
    console.error('Error in announcement view tracking API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track announcement view' },
      {
        status: 200, // Return 200 to prevent client-side errors
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  }
}

