'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BRANDING } from '@/lib/branding';
import { ArrowLeft, ExternalLink, AlertCircle, Info, Bell, Calendar, X, Share2, ChevronDown } from 'lucide-react';
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

// Helper function to get preview text (first 100 chars)
function getPreviewText(content: string): string {
  const stripped = content.replace(/<[^>]*>/g, '').trim();
  return stripped.length > 100 ? stripped.substring(0, 100) + '...' : stripped;
}

export default function AnnouncementsPage() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleOpenDialog = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsDialogOpen(true);
    // Track view when opening dialog
    fetch('/api/analytics/announcement-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ announcementId: announcement.id }),
      cache: 'no-store',
    }).catch((error) => {
      console.error('Failed to track announcement view:', error);
    });
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
                const previewText = getPreviewText(announcement.content);

                return (
                  <motion.div
                    key={announcement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card
                      className={`${styles.bg} ${styles.border} border-t border-r border-b shadow-lg hover:shadow-xl transition-all cursor-pointer`}
                      onClick={() => handleOpenDialog(announcement)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`${styles.iconBg} rounded-lg p-2 flex-shrink-0`}>
                              <Icon className={`h-5 w-5 ${styles.iconColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <CardTitle className="text-lg sm:text-xl">
                                  {announcement.title}
                                </CardTitle>
                                <Badge variant="outline" className={styles.badge}>
                                  {announcement.priority}
                                </Badge>
                              </div>
                              {announcement.createdAt && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDismiss(announcement.id);
                              }}
                              className="h-8 w-8 p-0 flex-shrink-0"
                              aria-label="Dismiss announcement"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {previewText}
                        </p>
                        <div className="flex items-center justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDialog(announcement);
                            }}
                            className="text-xs"
                          >
                            Read More
                            <ChevronDown className="h-4 w-4 ml-2" />
                          </Button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/announcements/${announcement.id}`);
                            }}
                            className="inline-flex items-center gap-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
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

      {/* Dialog for full announcement */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedAnnouncement && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <DialogTitle className="text-2xl">{selectedAnnouncement.title}</DialogTitle>
                  <Badge variant="outline" className={getPriorityStyles(selectedAnnouncement.priority).badge}>
                    {selectedAnnouncement.priority}
                  </Badge>
                </div>
                {selectedAnnouncement.createdAt && (
                  <DialogDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(selectedAnnouncement.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </DialogDescription>
                )}
              </DialogHeader>
              <div
                className="text-base leading-relaxed mb-4 prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: formatText(selectedAnnouncement.content) }}
              />
              {selectedAnnouncement.linkUrl && (
                <div className="mb-4">
                  <a
                    href={selectedAnnouncement.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    {selectedAnnouncement.linkText || 'Read More'}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/announcements/${selectedAnnouncement.id}`)}
                  className="text-xs"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Link
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
