import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface QuizHistorySheetProps {
    children: React.ReactNode;
}

export const QuizHistorySheet = ({ children }: QuizHistorySheetProps) => {
    const history = useQuery(api.quizzes.queries.getHistory);

    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent className="w-full sm:w-[540px] p-0">
                <SheetHeader className="p-6">
                    <SheetTitle>Quiz History</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 p-6">
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
                    {history?.map((quiz) => (
                        <Link href={`/quiz/${quiz._id}/results`} key={quiz._id} className="block border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                            <h3 className="font-semibold">{quiz.title}</h3>
                            <p className="text-sm text-muted-foreground">{quiz.topic}</p>
                            <div className="flex justify-between items-center mt-2">
                                <Badge variant={quiz.score && quiz.score > 70 ? "default" : "secondary"}>
                                    Score: {quiz.score}%
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(quiz.completedAt!).toLocaleDateString()}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    );
};
