"use client"
import { Container } from "@/components/container";
import { MainContent } from "@/components/main-content";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { ArrowLeft, CheckCircle, Clock, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// interface QuizResultsPageProps {
//   params: {
//     quizId: string;
//   };
// }

export default function QuizResultsPage() {
  const { quizId } = useParams()
  const results = useQuery(api.quizzes.queries.getQuizResults, { quizId: quizId as Id<"quizzes"> });

  if (!results) {
    return (
      <Container className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 rounded-full border-4 border-t-teal-600 border-teal-200 animate-spin mb-4" />
          <p className="text-gray-600">Loading results...</p>
        </div>
      </Container>
    );
  }

  const { quiz, questions, totalQuestions, correctAnswers } = results;
  const score = quiz.score || 0;
  const timeSpent = quiz.timeSpentSeconds || 0;

  // Format time spent (seconds to minutes and seconds)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Get score color based on score value
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Container className="min-h-screen py-8">
      <MainContent className="max-w-3xl">
        <div className="mb-8">
          <Link href={`/rooms/${quiz.threadId}`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Chat
            </Button>
          </Link>

          <h1 className="text-2xl font-bold text-gray-800">Quiz Results</h1>
          <p className="text-gray-600 mt-2">{quiz.title}</p>
        </div>

        {/* Results summary */}
        <div className="bg-white border rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
                {score}%
              </div>
              <p className="text-gray-600 mt-2">Score</p>
            </div>

            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <div className="text-4xl font-bold text-blue-600">
                {correctAnswers}/{totalQuestions}
              </div>
              <p className="text-gray-600 mt-2">Correct Answers</p>
            </div>

            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <div className="text-4xl font-bold text-teal-600">
                {formatTime(timeSpent)}
              </div>
              <p className="text-gray-600 mt-2">Time Spent</p>
            </div>
          </div>
        </div>

        {/* Question review */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Question Review</h2>

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

                  <h3 className="text-lg font-medium mb-4">{question.question}</h3>

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
                          <span>{option}</span>
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

                  <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Explanation</h4>
                    <p className="text-blue-700">{question.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <Link href={`/rooms/${quiz.threadId}`}>
            <Button variant="outline">
              Back to Chat
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button className="bg-teal-600 hover:bg-teal-700">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </MainContent>
    </Container>
  );
}
