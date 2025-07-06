import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";
import React from "react";
import { QuizReview } from "./quiz-review";

interface QuizHistorySheetProps {
    children: React.ReactNode;
    threadId: string;
}

export const QuizHistorySheet = ({ children, threadId }: QuizHistorySheetProps) => {
    const history = useQuery(api.quizzes.queries.getHistory, { threadId });

    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent className="w-full sm:w-[540px] md:min-w-[40rem] p-0 overflow-y-scroll h-screen">
                <SheetHeader className="px-6 pt-6">
                    <SheetTitle>Quiz History</SheetTitle>
                    <SheetDescription>View your quiz history and review your results.</SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-4 px-6">
                    {!history && (
                        <>
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                        </>
                    )}
                    {history && history.length === 0 && (
                        <div className="text-center text-muted-foreground py-8">
                            <p>No completed quizzes yet.</p>
                            <p className="text-sm">Take a quiz to see your history here.</p>
                        </div>
                    )}
                    <Accordion type="single" collapsible className="w-full">
                        {history?.map((quiz) => (
                            <AccordionItem value={quiz._id} key={quiz._id}>
                                <AccordionTrigger className="w-full text-left hover:no-underline hover:bg-secondary px-2">
                                    <div className="w-full">
                                        <h3 className="font-semibold">{quiz.title}</h3>
                                        <p className="text-sm text-muted-foreground truncate capitalize">{quiz.topic.toLowerCase()}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <Badge variant={quiz.score && quiz.score > 70 ? "default" : "secondary"}>
                                                Score: {quiz.score}%
                                            </Badge>
                                            {/* <span className="text-xs text-muted-foreground">
                                                {new Date(quiz.completedAt!).toLocaleDateString()}
                                            </span> */}

                                            <Link href={`/quiz/${quiz._id}/results`} target="_blank" className={buttonVariants({ size: "sm" })}>
                                                View Results
                                            </Link>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <QuizReview quizId={quiz._id} />
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </SheetContent>
        </Sheet>
    );
};
