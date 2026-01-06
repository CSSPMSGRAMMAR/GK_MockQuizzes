'use client';

import { useExamStore } from '@/stores/examStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, Circle, Flag, AlertCircle } from 'lucide-react';

export const QuestionNavigator = () => {
  const { questions, currentQuestionIndex, navigateToQuestion, getQuestionStatus, userAnswers } =
    useExamStore();

  const getStatusIcon = (questionId: string) => {
    const status = getQuestionStatus(questionId);

    switch (status) {
      case 'attempted':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'marked':
        return <Flag className="h-4 w-4" />;
      case 'answered-marked':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (questionId: string) => {
    const status = getQuestionStatus(questionId);

    switch (status) {
      case 'attempted':
        return 'bg-green-500 hover:bg-green-600 text-white';
      case 'marked':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      case 'answered-marked':
        return 'bg-purple-500 hover:bg-purple-600 text-white';
      default:
        return 'bg-muted hover:bg-muted/80';
    }
  };

  // Calculate statistics
  const attempted = questions.filter(
    (q) => userAnswers.get(q.id)?.selectedOptionId
  ).length;
  const unattempted = questions.length - attempted;
  const marked = questions.filter(
    (q) => userAnswers.get(q.id)?.isMarkedForReview
  ).length;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Question Palette</CardTitle>
        
        {/* Statistics */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="text-center p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">
              {attempted}
            </div>
            <div className="text-xs text-green-600 dark:text-green-500">Answered</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted">
            <div className="text-2xl font-bold">{unattempted}</div>
            <div className="text-xs text-muted-foreground">Not Answered</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
            <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
              {marked}
            </div>
            <div className="text-xs text-yellow-600 dark:text-yellow-500">Marked</div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-green-500 flex items-center justify-center">
              <CheckCircle2 className="h-3 w-3 text-white" />
            </div>
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
              <Circle className="h-3 w-3" />
            </div>
            <span>Not Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-yellow-500 flex items-center justify-center">
              <Flag className="h-3 w-3 text-white" />
            </div>
            <span>Marked for Review</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-purple-500 flex items-center justify-center">
              <AlertCircle className="h-3 w-3 text-white" />
            </div>
            <span>Answered & Marked</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[300px] sm:h-[400px] pr-2 sm:pr-4">
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {questions.map((question, index) => (
              <Button
                key={question.id}
                variant={currentQuestionIndex === index ? 'default' : 'outline'}
                size="sm"
                className={`h-8 sm:h-10 w-full text-xs transition-all hover:scale-105 ${
                  currentQuestionIndex === index
                    ? 'ring-2 ring-primary'
                    : getStatusColor(question.id)
                }`}
                onClick={() => navigateToQuestion(index)}
              >
                <div className="flex flex-col items-center gap-0.5">
                  {getStatusIcon(question.id)}
                  <span className="text-[10px] sm:text-xs">{question.questionNumber}</span>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

