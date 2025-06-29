"use client"
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseQuizProps {
  quizId: Id<"quizzes">;
}

export const useQuiz = ({ quizId }: UseQuizProps) => {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean[]>([]);
  const [quizStartTime, setQuizStartTime] = useState<number>(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Fetch quiz data
  const quiz = useQuery(api.quizzes.queries.getQuiz, { quizId });
  const questions = useQuery(api.quizzes.queries.getQuizQuestions, { quizId });

  // Mutations
  const startQuizMutation = useMutation(api.quizzes.mutations.startQuiz);
  const submitAnswerMutation = useMutation(api.quizzes.mutations.submitQuizAnswer);
  const completeQuizMutation = useMutation(api.quizzes.mutations.completeQuiz);

  // Initialize quiz state
  useEffect(() => {
    if (quiz && quiz.status === "pending") {
      startQuizMutation({ quizId });
      setQuizStartTime(Date.now());
      setQuestionStartTime(Date.now());
    }

    if (questions) {
      setUserAnswers(new Array(questions.length).fill(-1));
      setIsSubmitted(new Array(questions.length).fill(false));
    }
  }, [quiz, questions, quizId, startQuizMutation]);

  // Handle selecting an answer
  const selectAnswer = useCallback((questionIndex: number, optionIndex: number) => {
    setUserAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = optionIndex;
      return newAnswers;
    });
  }, []);

  // Handle submitting an answer
  const submitAnswer = useCallback(async (questionIndex: number) => {
    if (!questions || questionIndex >= questions.length || userAnswers[questionIndex] === -1) {
      return;
    }

    const question = questions[questionIndex];
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);

    const result = await submitAnswerMutation({
      userId: quiz!.userId,
      quizId,
      questionId: question._id,
      selectedOptionIndex: userAnswers[questionIndex],
      timeSpentSeconds: timeSpent,
    });

    setIsSubmitted(prev => {
      const newSubmitted = [...prev];
      newSubmitted[questionIndex] = true;
      return newSubmitted;
    });

    return result;
  }, [questions, userAnswers, questionStartTime, submitAnswerMutation, quiz, quizId]);

  // Handle moving to the next question
  const nextQuestion = useCallback(() => {
    if (!questions || currentQuestionIndex >= questions.length - 1) {
      return;
    }

    setCurrentQuestionIndex(prev => prev + 1);
    setQuestionStartTime(Date.now());

    // Scroll to the next question with a slight delay to ensure rendering
    setTimeout(() => {
      questionRefs.current[currentQuestionIndex + 1]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }, [currentQuestionIndex, questions]);

  // Handle finishing the quiz
  const finishQuiz = useCallback(async () => {
    const result = await completeQuizMutation({ quizId });
    router.push(`/quiz/${quizId}/results`);
    return result;
  }, [completeQuizMutation, quizId, router]);

  // Check if all questions are answered and submitted
  const isQuizCompleted = useCallback(() => {
    if (!questions) return false;
    return isSubmitted.every(submitted => submitted);
  }, [questions, isSubmitted]);

  return {
    quiz,
    questions,
    currentQuestionIndex,
    userAnswers,
    isSubmitted,
    questionRefs,
    selectAnswer,
    submitAnswer,
    nextQuestion,
    finishQuiz,
    isQuizCompleted,
  };
};
