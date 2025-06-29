"use client"
import { Container } from "@/components/container";
import { MainContent } from "@/components/main-content";
import { Id } from "@/convex/_generated/dataModel";
import { useQuiz } from "@/features/quiz/hooks/use-quiz";
import { QuizQuestion } from "@/features/quiz/quiz-question";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

// interface QuizPageProps {
//     params: Promise<{
//         quizId: string;
//     }>;
// }

export default function QuizPage() {
    // Cast the quizId to the correct type
    const { quizId } = useParams()

    const {
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
    } = useQuiz({ quizId: quizId as Id<"quizzes"> });

    // Handle submission of the current question
    const handleSubmit = async () => {
        await submitAnswer(currentQuestionIndex);
    };

    // Handle moving to the next question or finishing the quiz
    const handleNext = () => {
        if (questions && currentQuestionIndex === questions.length - 1) {
            finishQuiz();
        } else {
            nextQuestion();
        }
    };

    // If data is loading, show a loading state
    if (!quiz || !questions) {
        return (
            <Container className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-teal-600 mb-4" />
                    <p className="text-gray-600">Loading quiz...</p>
                </div>
            </Container>
        );
    }

    return (
        <Container className="min-h-screen py-8">
            <MainContent className="max-w-3xl">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">{quiz.title}</h1>
                    {quiz.description && (
                        <p className="text-gray-600 mt-2">{quiz.description}</p>
                    )}
                    <div className="flex items-center mt-4">
                        <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
                            {quiz.topic}
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium ml-2">
                            {quiz.difficulty}
                        </span>
                        <span className="text-gray-500 ml-auto">
                            {currentQuestionIndex + 1} of {questions.length} questions
                        </span>
                    </div>
                </div>

                <div className="space-y-8">
                    {questions.map((question, index) => (
                        index <= currentQuestionIndex && (
                            <QuizQuestion
                                key={question._id}
                                ref={(el: HTMLDivElement | null) => { questionRefs.current[index] = el; return undefined; }}
                                questionNumber={index + 1}
                                question={question.question}
                                options={question.options}
                                selectedOption={userAnswers[index]}
                                correctOption={isSubmitted[index] ? question.correctOptionIndex : undefined}
                                explanation={isSubmitted[index] ? question.explanation : undefined}
                                isSubmitted={isSubmitted[index]}
                                onSelectOption={(optionIndex) => selectAnswer(index, optionIndex)}
                                onSubmit={() => handleSubmit()}
                                onNext={handleNext}
                                isLast={index === questions.length - 1}
                            />
                        )
                    ))}
                </div>
            </MainContent>
        </Container>
    );
}
