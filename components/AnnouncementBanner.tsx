'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, ExternalLink, AlertCircle, Info, Bell, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import type { Announcement } from '@/lib/announcements';

interface AnnouncementBannerProps {
  announcements: Announcement[];
  onDismiss?: (id: string) => void;
}

// Helper function to format plain text (convert newlines to breaks, limit preview length)
function formatPreviewText(text: string, maxLength: number = 120): string {
  // Remove HTML tags if present, then format
  const plainText = text.replace(/<[^>]*>/g, ' ').trim();
  // Convert newlines to spaces for preview
  const singleLine = plainText.replace(/\n+/g, ' ').replace(/\s+/g, ' ');
  
  if (singleLine.length <= maxLength) {
    return singleLine;
  }
  
  // Truncate at word boundary
  const truncated = singleLine.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
}

export function AnnouncementBanner({ announcements, onDismiss }: AnnouncementBannerProps) {
  const router = useRouter();
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
  }, []);

  // Filter out dismissed announcements
  const visibleAnnouncements = announcements.filter(
    (announcement) => !dismissedIds.includes(announcement.id)
  );

  // Get highest priority announcement (if any)
  const topAnnouncement = visibleAnnouncements.find((a) => a.priority === 'high') || visibleAnnouncements[0];

  if (!topAnnouncement) {
    return null;
  }

  const handleDismiss = (id: string) => {
    const newDismissed = [...dismissedIds, id];
    setDismissedIds(newDismissed);
    localStorage.setItem('dismissedAnnouncements', JSON.stringify(newDismissed));
    if (onDismiss) {
      onDismiss(id);
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
          text: 'text-foreground',
          icon: AlertCircle,
          badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
        };
      case 'medium':
        return {
          bg: 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20',
          border: 'border-l-4 border-blue-500',
          iconBg: 'bg-blue-100 dark:bg-blue-900/30',
          iconColor: 'text-blue-600 dark:text-blue-400',
          text: 'text-foreground',
          icon: Info,
          badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950/20 dark:via-gray-950/20 dark:to-zinc-950/20',
          border: 'border-l-4 border-slate-400',
          iconBg: 'bg-slate-100 dark:bg-slate-900/30',
          iconColor: 'text-slate-600 dark:text-slate-400',
          text: 'text-foreground',
          icon: Bell,
          badge: 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20',
        };
    }
  };

  const styles = getPriorityStyles(topAnnouncement.priority);
  const Icon = styles.icon;
  const previewText = formatPreviewText(topAnnouncement.content, 100);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="w-full mb-6"
      >
        <div
          className={`${styles.bg} ${styles.border} border-t border-r border-b rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden`}
        >
          <div className="p-4 sm:p-5">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`flex-shrink-0 ${styles.iconBg} rounded-lg p-2.5`}>
                <Icon className={`h-5 w-5 ${styles.iconColor}`} />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base sm:text-lg text-foreground mb-1.5 leading-tight">
                      {topAnnouncement.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {previewText}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDismiss(topAnnouncement.id)}
                    className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-background/50"
                    aria-label="Dismiss announcement"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  {topAnnouncement.linkUrl && (
                    <a
                      href={topAnnouncement.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
                    >
                      <span>{topAnnouncement.linkText || 'Read More'}</span>
                      <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  )}
                  <button
                    onClick={() => router.push(`/announcements/${topAnnouncement.id}`)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    <span>View Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => router.push('/announcements')}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span>View All</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

