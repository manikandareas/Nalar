"use client"
import { Container } from "@/components/container";
import { MainContent } from "@/components/main-content";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Id } from "@/convex/_generated/dataModel";
import { useQuiz } from "@/features/quiz/hooks/use-quiz";
import { QuizQuestion } from "@/features/quiz/quiz-question";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function QuizPage() {
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
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Loading quiz...</p>
                </div>
            </Container>
        );
    }

    return (
        <Container className="min-h-screen py-8 relative">
            <MainContent className="max-w-3xl">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-foreground">{quiz.title}</h1>
                    {quiz.description && (
                        <div className="text-muted-foreground mt-2">
                            <MarkdownRenderer content={quiz.description} />
                        </div>
                    )}
                    <div className="flex items-center mt-4">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                            {quiz.topic}
                        </span>
                        <span className="bg-secondary/10 text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium ml-2">
                            {quiz.difficulty}
                        </span>
                        <span className="text-muted-foreground ml-auto">
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
            <Image src="/assets/pondering.svg" width={400} height={400} alt="Pondering" className="fixed bottom-0 left-0 transform -translate-x-1/4" />

        </Container>
    );
}
