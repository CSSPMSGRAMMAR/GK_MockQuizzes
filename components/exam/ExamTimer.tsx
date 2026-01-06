'use client';

import { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { useExamStore } from '@/stores/examStore';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const ExamTimer = () => {
  const { timeRemaining, updateTimer, isExamStarted, isExamCompleted } = useExamStore();
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!isExamStarted || isExamCompleted) return;

    const interval = setInterval(() => {
      updateTimer(timeRemaining - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isExamStarted, isExamCompleted, timeRemaining, updateTimer]);

  useEffect(() => {
    // Show warning when 10 minutes remaining
    if (timeRemaining === 600 && !showWarning) {
      setShowWarning(true);
    }
    // Hide warning after 5 seconds
    if (showWarning && timeRemaining < 595) {
      setShowWarning(false);
    }
  }, [timeRemaining, showWarning]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeRemaining < 600; // Less than 10 minutes
  const isCriticalTime = timeRemaining < 300; // Less than 5 minutes

  return (
    <div className="space-y-2">
      <div
        className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-mono text-sm sm:text-lg font-semibold transition-all ${
          isCriticalTime
            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 shadow-sm'
            : isLowTime
            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 shadow-sm'
            : 'bg-muted text-foreground'
        }`}
      >
        <Clock className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 ${isCriticalTime ? 'animate-pulse' : ''}`} />
        <span className="whitespace-nowrap">{formatTime(timeRemaining)}</span>
      </div>

      {showWarning && (
        <Alert variant="destructive" className="animate-in slide-in-from-top text-xs sm:text-sm">
          <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" />
          <AlertDescription className="text-xs sm:text-sm">Only 10 minutes remaining!</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

