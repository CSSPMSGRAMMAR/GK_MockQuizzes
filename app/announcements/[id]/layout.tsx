import { Metadata } from 'next';
import { getAnnouncementById } from '@/lib/announcements';
import { BRANDING } from '@/lib/branding';

// Helper function to strip HTML tags for description
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().substring(0, 160);
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const announcement = await getAnnouncementById(params.id);
    
    if (!announcement) {
      return {
        title: 'Announcement Not Found',
        description: 'The announcement you are looking for does not exist.',
      };
    }

    const description = stripHtml(announcement.content);
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com';
    const url = `${siteUrl}/announcements/${params.id}`;
    const title = `${announcement.title} - ${BRANDING.name}`;

    return {
      title,
      description: description || announcement.title,
      openGraph: {
        title,
        description: description || announcement.title,
        url,
        siteName: BRANDING.name,
        type: 'article',
        publishedTime: announcement.createdAt,
        modifiedTime: announcement.updatedAt,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: description || announcement.title,
      },
      alternates: {
        canonical: url,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Announcement - ' + BRANDING.name,
      description: BRANDING.tagline,
    };
  }
}

export default function AnnouncementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

