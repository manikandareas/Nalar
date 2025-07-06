import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";

import { BotMessageSquare, CheckCircle, Clock, XCircle } from "lucide-react";

interface QuizReviewProps {
    quizId: Id<"quizzes">;
    showAskAction?: boolean
}

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
};

export const QuizReview = ({ quizId, showAskAction = true }: QuizReviewProps) => {
    const { data: results, isLoading } = useQuery(convexQuery(api.quizzes.queries.getQuizResults, { quizId }))

    if (!results || isLoading) {
        return (
            <div className="space-y-6">
                <div className="border rounded-lg p-6 bg-white animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="space-y-3 mb-6">
                        <div className="h-10 bg-gray-200 rounded"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                </div>
            </div>
        )
    }

    const { questions } = results;

    return (
        <div className="space-y-6">
            {questions.map((item, index) => {
                const question = item;
                const response = item.response;
                const isCorrect = response?.isCorrect;

                return (
                    <div key={question._id} className="border rounded-lg p-6 bg-white">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-medium">
                                    Question {index + 1}
                                </span>
                            </div>
                            <div className="flex items-center">
                                {isCorrect ? (
                                    <div className="flex items-center text-green-600">
                                        <CheckCircle className="h-5 w-5 mr-1" />
                                        <span>Correct</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center text-red-600">
                                        <XCircle className="h-5 w-5 mr-1" />
                                        <span>Incorrect</span>
                                    </div>
                                )}

                                {response && (
                                    <div className="flex items-center text-gray-500 ml-4">
                                        <Clock className="h-4 w-4 mr-1" />
                                        <span>{formatTime(response.timeSpentSeconds)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="text-lg font-medium mb-4">
                            <MarkdownRenderer content={question.question} />
                        </div>

                        <div className="space-y-3 mb-6">
                            {question.options.map((option, optionIndex) => (
                                <div
                                    key={optionIndex}
                                    className={`border rounded-md p-4 ${optionIndex === question.correctOptionIndex
                                        ? "border-green-500 bg-green-50"
                                        : response && optionIndex === response.selectedOptionIndex && optionIndex !== question.correctOptionIndex
                                            ? "border-red-500 bg-red-50"
                                            : "border-gray-200"
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <MarkdownRenderer content={option} />
                                        </div>
                                        {optionIndex === question.correctOptionIndex && (
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        )}
                                        {response && optionIndex === response.selectedOptionIndex && optionIndex !== question.correctOptionIndex && (
                                            <XCircle className="h-5 w-5 text-red-500" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-6">
                            <h4 className="font-medium text-blue-800 mb-2">Explanation</h4>
                            <div className="text-blue-700"><MarkdownRenderer content={question.explanation} /></div>
                        </div>

                        {showAskAction && <Button className="">Add to chat <BotMessageSquare /></Button>}
                    </div>
                );
            })}
        </div>
    );
}
