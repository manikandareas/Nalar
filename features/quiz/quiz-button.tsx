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
      <Button onClick={handleStartQuiz} size="lg">
        Start Quiz
      </Button>
    </div>
  );
};
