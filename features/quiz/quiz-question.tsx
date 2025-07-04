import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";
import { forwardRef } from "react";

interface QuizQuestionProps {
  questionNumber: number;
  question: string;
  options: string[];
  selectedOption: number;
  correctOption?: number;
  explanation?: string;
  isSubmitted: boolean;
  onSelectOption: (optionIndex: number) => void;
  onSubmit: () => void;
  onNext: () => void;
  isLast: boolean;
}

export const QuizQuestion = forwardRef<HTMLDivElement, QuizQuestionProps>(
  ({
    questionNumber,
    question,
    options,
    selectedOption,
    correctOption,
    explanation,
    isSubmitted,
    onSelectOption,
    onSubmit,
    onNext,
    isLast
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "border rounded-lg p-6 mb-8 bg-card shadow-sm",
          isSubmitted ? "border" : "border-primary/20"
        )}
      >
        <div className="mb-4">
          <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium">
            Question {questionNumber}
          </span>
        </div>

        <div className="text-xl font-semibold mb-6">
          <MarkdownRenderer content={question} />
        </div>

        <div className="space-y-3 mb-6">
          {options.map((option, index) => (
            <div
              key={index}
              className={cn(
                "border rounded-md p-4 cursor-pointer transition-all",
                !isSubmitted && selectedOption === index ? "border-primary bg-primary/10" : "border hover:border-border/80",
                isSubmitted && selectedOption === index && selectedOption === correctOption ? "border-emerald-500 bg-emerald-500/10" : "",
                isSubmitted && selectedOption === index && selectedOption !== correctOption ? "border-destructive bg-destructive/10" : "",
                isSubmitted && index === correctOption ? "border-emerald-500 bg-emerald-500/10" : ""
              )}
              onClick={() => !isSubmitted && onSelectOption(index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <MarkdownRenderer content={option} />
                </div>
                {isSubmitted && (
                  <>
                    {index === correctOption && (
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    )}
                    {selectedOption === index && index !== correctOption && (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {isSubmitted && explanation && (
          <div className="bg-accent/50 border border-accent rounded-md p-4 mb-6">
            <h4 className="font-medium text-accent-foreground mb-2">Explanation</h4>
            <div className="text-accent-foreground/80">
              <MarkdownRenderer content={explanation} />
            </div>
          </div>
        )}

        <div className="flex justify-end">
          {!isSubmitted ? (
            <Button
              onClick={onSubmit}
              disabled={selectedOption === -1}
            >
              Submit
            </Button>
          ) : (
            <Button
              onClick={onNext}
            >
              {isLast ? "Finish" : "Next Question"}
            </Button>
          )}
        </div>
      </div>
    );
  }
);
