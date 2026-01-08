import { NextRequest, NextResponse } from 'next/server';
import {
  getActiveAnnouncements,
  getAllAnnouncements,
  createAnnouncement,
  type Announcement,
} from '@/lib/announcements';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

// GET - Get announcements (public gets active only, admin gets all)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin') === 'true';

    let announcements: Announcement[];
    if (admin) {
      announcements = await getAllAnnouncements();
    } else {
      announcements = await getActiveAnnouncements();
    }

    return NextResponse.json(announcements, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error getting announcements:', error);
    return NextResponse.json(
      { error: 'Failed to get announcements' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  }
}

// POST - Create new announcement (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      content,
      isActive = true,
      priority = 'medium',
      hideOtherContent = false,
      expiresAt,
      linkUrl,
      linkText,
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const announcement = await createAnnouncement({
      title,
      content,
      isActive,
      priority,
      hideOtherContent,
      expiresAt,
      linkUrl,
      linkText,
    });

    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json(
      { error: 'Failed to create announcement' },
      { status: 500 }
    );
  }
}


