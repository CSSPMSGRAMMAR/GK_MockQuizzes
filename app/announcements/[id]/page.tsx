'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BRANDING } from '@/lib/branding';
import { ArrowLeft, ExternalLink, AlertCircle, Info, Bell, Calendar, Share2, Copy, Check } from 'lucide-react';
import type { Announcement } from '@/lib/announcements';

// Helper function to format plain text (convert newlines to breaks)
function formatText(text: string): string {
  if (/<[^>]+>/.test(text)) {
    return text;
  }
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('<br>');
}

export default function AnnouncementDetailPage() {
  const router = useRouter();
  const params = useParams();
  const announcementId = params.id as string;
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadAnnouncement();
    // Track announcement view
    if (announcementId) {
      fetch('/api/analytics/announcement-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ announcementId }),
        cache: 'no-store',
      }).catch((error) => {
        console.error('Failed to track announcement view:', error);
      });
    }
  }, [announcementId]);

  const loadAnnouncement = async () => {
    try {
      const timestamp = Date.now();
      const response = await fetch(`/api/announcements?t=${timestamp}`, {
        cache: 'no-store',
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const found = data.find((a: Announcement) => a.id === announcementId);
        setAnnouncement(found || null);
      }
    } catch (err) {
      console.error('Error loading announcement:', err);
    } finally {
      setLoading(false);
    }
  };

  const shareableUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/announcements/${announcementId}`
    : '';

  const handleCopyLink = async () => {
    if (shareableUrl) {
      try {
        await navigator.clipboard.writeText(shareableUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const handleShare = (platform: string) => {
    const text = announcement?.title || 'Check out this announcement';
    const url = shareableUrl;
    
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          bg: 'bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-red-950/20',
          border: 'border-l-4 border-amber-500',
          iconBg: 'bg-amber-100 dark:bg-amber-900/30',
          iconColor: 'text-amber-600 dark:text-amber-400',
          badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
          icon: AlertCircle,
        };
      case 'medium':
        return {
          bg: 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20',
          border: 'border-l-4 border-blue-500',
          iconBg: 'bg-blue-100 dark:bg-blue-900/30',
          iconColor: 'text-blue-600 dark:text-blue-400',
          badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
          icon: Info,
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950/20 dark:via-gray-950/20 dark:to-zinc-950/20',
          border: 'border-l-4 border-slate-400',
          iconBg: 'bg-slate-100 dark:bg-slate-900/30',
          iconColor: 'text-slate-600 dark:text-slate-400',
          badge: 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20',
          icon: Bell,
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading announcement...</p>
        </div>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Announcement Not Found</h2>
          <p className="text-muted-foreground mb-6">The announcement you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push('/announcements')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Announcements
          </Button>
        </Card>
      </div>
    );
  }

  const styles = getPriorityStyles(announcement.priority);
  const Icon = styles.icon;
  const formattedContent = formatText(announcement.content);

  return (
    <div className="min-h-screen bg-background academic-hero relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-background to-primary/5"></div>
      </div>

      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link href="/" className="flex items-center space-x-3 group shrink-0">
              <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden shadow-elegant transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={BRANDING.logo}
                  alt={BRANDING.name}
                  fill
                  sizes="(max-width: 640px) 40px, 48px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <span className="font-display font-bold text-lg sm:text-xl bg-academic-gradient bg-clip-text text-transparent">
                  {BRANDING.name}
                </span>
                <p className="text-xs text-muted-foreground font-accent">{BRANDING.tagline}</p>
              </div>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="text-xs sm:text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className={`${styles.bg} ${styles.border} border-t border-r border-b rounded-lg shadow-lg overflow-hidden`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`${styles.iconBg} rounded-lg p-3 flex-shrink-0`}>
                      <Icon className={`h-6 w-6 ${styles.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <CardTitle className="text-2xl sm:text-3xl">
                          {announcement.title}
                        </CardTitle>
                        <Badge variant="outline" className={styles.badge}>
                          {announcement.priority}
                        </Badge>
                      </div>
                      {announcement.createdAt && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div
                  className="text-base sm:text-lg leading-relaxed mb-6 prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: formattedContent }}
                />
                {announcement.linkUrl && (
                  <div className="mb-6">
                    <a
                      href={announcement.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-base font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      {announcement.linkText || 'Read More'}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                )}

                {/* Share Section */}
                <div className="border-t pt-6 mt-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="font-semibold text-sm text-muted-foreground mb-2">Share this announcement</h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopyLink}
                          className="text-xs sm:text-sm"
                        >
                          {copied ? (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Link
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShare('twitter')}
                          className="text-xs sm:text-sm"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Twitter
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShare('facebook')}
                          className="text-xs sm:text-sm"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Facebook
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShare('linkedin')}
                          className="text-xs sm:text-sm"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          LinkedIn
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShare('whatsapp')}
                          className="text-xs sm:text-sm"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          WhatsApp
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p className="font-medium mb-1">Shareable Link:</p>
                      <code className="bg-muted px-2 py-1 rounded text-xs break-all">
                        {shareableUrl}
                      </code>
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}


