"use client"
"use client"
import { Container } from "@/components/container";
import { MainContent } from "@/components/main-content";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { QuizReview } from "@/features/quiz/quiz-review";
import { useQuery } from "convex/react";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

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

  const { quiz, totalQuestions, correctAnswers } = results;
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
    <Container className="min-h-screen py-8 relative">
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
          <QuizReview quizId={quizId as Id<"quizzes">} />
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <Link href={`/rooms/${quiz.threadId}`}>
            <Button variant="outline">
              Back to Chat
            </Button>
          </Link>

          <Link href="/rooms">
            <Button>
              Go to Home
            </Button>
          </Link>
        </div>
      </MainContent>
      {
        quiz?.score && quiz.score >= 75 ? <Image src={"/assets/jumping.svg"} alt="Girl Riding Scooter" width={500} height={500} className="fixed bottom-0 left-0 transform -translate-x-1/5 hidden lg:block" /> : <Image src={"/assets/safe-and-secure.svg"} alt="Girl Riding Scooter" width={500} height={500} className="fixed bottom-0 left-0 transform -translate-x-1/5 hidden lg:block" />
      }
    </Container>
  );
}
