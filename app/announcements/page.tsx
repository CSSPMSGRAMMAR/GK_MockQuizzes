'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BRANDING } from '@/lib/branding';
import { ArrowLeft, ExternalLink, AlertCircle, Info, Bell, Calendar, X, Share2 } from 'lucide-react';
import type { Announcement } from '@/lib/announcements';

// Helper function to format plain text (convert newlines to breaks)
function formatText(text: string): string {
  // If it already contains HTML tags, return as is
  if (/<[^>]+>/.test(text)) {
    return text;
  }
  // Otherwise, convert newlines to <br> tags
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('<br>');
}

export default function AnnouncementsPage() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  useEffect(() => {
    // Load dismissed announcements from localStorage
    const stored = localStorage.getItem('dismissedAnnouncements');
    if (stored) {
      try {
        setDismissedIds(JSON.parse(stored));
      } catch (e) {
        // Ignore parse errors
      }
    }

    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
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
        setAnnouncements(data);
      }
    } catch (err) {
      console.error('Error loading announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = (id: string) => {
    const newDismissed = [...dismissedIds, id];
    setDismissedIds(newDismissed);
    localStorage.setItem('dismissedAnnouncements', JSON.stringify(newDismissed));
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          bg: 'bg-gradient-to-r from-orange-500 to-red-500',
          text: 'text-white',
          icon: AlertCircle,
          badge: 'destructive',
        };
      case 'medium':
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-indigo-500',
          text: 'text-white',
          icon: Info,
          badge: 'default',
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-purple-500 to-pink-500',
          text: 'text-white',
          icon: Bell,
          badge: 'secondary',
        };
    }
  };

  const visibleAnnouncements = announcements.filter(
    (announcement) => !dismissedIds.includes(announcement.id)
  );

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
            <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2">Announcements</h1>
            <p className="text-muted-foreground">Stay updated with the latest news and updates</p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading announcements...</p>
            </div>
          ) : visibleAnnouncements.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No active announcements at the moment.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {visibleAnnouncements.map((announcement, index) => {
                const styles = getPriorityStyles(announcement.priority);
                const Icon = styles.icon;
                const formattedContent = formatText(announcement.content);

                return (
                  <motion.div
                    key={announcement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card
                      className={`${styles.bg} ${styles.text} border-0 shadow-lg hover:shadow-xl transition-shadow`}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <Icon className="h-5 w-5 sm:h-6 sm:w-6 mt-1 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <CardTitle className="text-lg sm:text-xl">
                                  {announcement.title}
                                </CardTitle>
                                <Badge variant={styles.badge as any} className="text-xs">
                                  {announcement.priority}
                                </Badge>
                              </div>
                              {announcement.createdAt && (
                                <div className="flex items-center gap-2 text-xs opacity-80">
                                  <Calendar className="h-3 w-3" />
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
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDismiss(announcement.id)}
                            className={`${styles.text} hover:bg-white/20 h-8 w-8 p-0 flex-shrink-0`}
                            aria-label="Dismiss announcement"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div
                          className="text-sm sm:text-base leading-relaxed mb-4 prose prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: formattedContent }}
                        />
                        <div className="flex items-center gap-3 flex-wrap mt-4">
                          {announcement.linkUrl && (
                            <a
                              href={announcement.linkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold underline hover:opacity-80 transition-opacity"
                            >
                              {announcement.linkText || 'Read More'}
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                          <button
                            onClick={() => router.push(`/announcements/${announcement.id}`)}
                            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                          >
                            <Share2 className="h-4 w-4" />
                            Share
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

