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
          "border rounded-lg p-6 mb-8 bg-white shadow-sm",
          isSubmitted ? "border-gray-300" : "border-teal-200"
        )}
      >
        <div className="mb-4">
          <span className="inline-block bg-teal-100 text-teal-800 px-2 py-1 rounded text-sm font-medium">
            Question {questionNumber}
          </span>
        </div>

        <h3 className="text-xl font-semibold mb-6">{question}</h3>

        <div className="space-y-3 mb-6">
          {options.map((option, index) => (
            <div
              key={index}
              className={cn(
                "border rounded-md p-4 cursor-pointer transition-all",
                !isSubmitted && selectedOption === index ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:border-gray-300",
                isSubmitted && selectedOption === index && selectedOption === correctOption ? "border-green-500 bg-green-50" : "",
                isSubmitted && selectedOption === index && selectedOption !== correctOption ? "border-red-500 bg-red-50" : "",
                isSubmitted && index === correctOption ? "border-green-500 bg-green-50" : ""
              )}
              onClick={() => !isSubmitted && onSelectOption(index)}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {isSubmitted && (
                  <>
                    {index === correctOption && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {selectedOption === index && index !== correctOption && (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {isSubmitted && explanation && (
          <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-6">
            <h4 className="font-medium text-blue-800 mb-2">Explanation</h4>
            <p className="text-blue-700">{explanation}</p>
          </div>
        )}

        <div className="flex justify-end">
          {!isSubmitted ? (
            <Button
              onClick={onSubmit}
              disabled={selectedOption === -1}
              className="bg-teal-600 hover:bg-teal-700"
            >
              Submit
            </Button>
          ) : (
            <Button
              onClick={onNext}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {isLast ? "Finish" : "Next Question"}
            </Button>
          )}
        </div>
      </div>
    );
  }
);
