import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FC } from "react";

interface QuizButtonProps {
  quizId: string;
}

export const QuizButton: FC<QuizButtonProps> = ({ quizId }) => {
  const router = useRouter();

  const handleStartQuiz = () => {
    router.push(`/quiz/${quizId}`);
  };

  return (
    <div className="flex justify-center my-4">
      <Button 
        onClick={handleStartQuiz}
        className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-2"
      >
        Start Quiz
      </Button>
    </div>
  );
};
