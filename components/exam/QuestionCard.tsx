'use client';

import { MCQuestion } from '@/types/exam';
import { useExamStore } from '@/stores/examStore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Flag, X } from 'lucide-react';

interface QuestionCardProps {
  question: MCQuestion;
}

export const QuestionCard = ({ question }: QuestionCardProps) => {
  const { userAnswers, selectAnswer, clearAnswer, toggleMarkForReview } = useExamStore();
  
  const answer = userAnswers.get(question.id);
  const selectedOptionId = answer?.selectedOptionId || '';
  const isMarked = answer?.isMarkedForReview || false;

  const handleOptionSelect = (optionId: string) => {
    selectAnswer(question.id, optionId);
  };

  const handleClearAnswer = () => {
    clearAnswer(question.id);
  };

  const handleToggleMark = () => {
    toggleMarkForReview(question.id);
  };

  return (
    <Card className="border-2">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                Question {question.questionNumber}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {question.category}
              </Badge>
              {isMarked && (
                <Badge variant="default" className="text-xs bg-yellow-500 hover:bg-yellow-600">
                  <Flag className="h-3 w-3 mr-1" />
                  Marked
                </Badge>
              )}
            </div>
            <h3 className="text-lg font-semibold leading-relaxed">{question.question}</h3>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <RadioGroup value={selectedOptionId} onValueChange={handleOptionSelect}>
          <div className="space-y-3">
            {question.options.map((option) => (
              <div
                key={option.id}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:bg-accent ${
                  selectedOptionId === option.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border'
                }`}
                onClick={() => handleOptionSelect(option.id)}
              >
                <RadioGroupItem value={option.id} id={option.id} />
                <Label
                  htmlFor={option.id}
                  className="flex-1 cursor-pointer text-base leading-relaxed"
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>

        <div className="flex gap-2 pt-2">
          <Button
            variant={isMarked ? 'default' : 'outline'}
            size="sm"
            onClick={handleToggleMark}
            className={isMarked ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
          >
            <Flag className="h-4 w-4 mr-2" />
            {isMarked ? 'Unmark' : 'Mark for Review'}
          </Button>

          {selectedOptionId && (
            <Button variant="outline" size="sm" onClick={handleClearAnswer}>
              <X className="h-4 w-4 mr-2" />
              Clear Answer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

