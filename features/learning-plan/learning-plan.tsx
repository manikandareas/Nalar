"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { CheckCircle, Circle, Dot, Loader2, Play } from "lucide-react";

export function LearningPlan() {
    const learningPlan = useQuery(api.learning.queries.getMyLearningPlan);
    const updateStepStatus = useMutation(api.learning.mutations.updateLearningPlanStepStatus);

    if (learningPlan === undefined) {
        return (
            <div className="flex items-center justify-center w-full h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!learningPlan) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Your Learning Plan</CardTitle>
                    <CardDescription>Your personalized learning plan will appear here once it's generated.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">It looks like you don't have a learning plan yet. If you've just completed your onboarding, it may take a few moments to generate.</p>
                </CardContent>
            </Card>
        );
    }

    const handleUpdateStatus = (stepIndex: number, status: "in-progress" | "completed") => {
        if (!learningPlan) return;
        updateStepStatus({
            planId: learningPlan._id,
            stepIndex,
            status,
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed":
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case "in-progress":
                return <Play className="w-5 h-5 text-blue-500 fill-current" />;
            default:
                return <Circle className="w-5 h-5 text-muted-foreground" />;
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{learningPlan.title}</CardTitle>
                <CardDescription>{learningPlan.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {learningPlan.steps.map((step, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-3">
                                    {getStatusIcon(step.status)}
                                    <span className="text-lg font-semibold">{step.title}</span>
                                </div>
                                <Badge variant={step.status === "completed" ? "default" : "secondary"}>
                                    {step.status.replace("-", " ")}
                                </Badge>
                            </AccordionTrigger>
                            <AccordionContent className="pl-8">
                                <p className="mb-4 text-muted-foreground">{step.description}</p>
                                {step.resources && step.resources.length > 0 && (
                                    <div>
                                        <h4 className="mb-2 font-semibold">Resources:</h4>
                                        <ul className="space-y-2 list-disc list-inside">
                                            {step.resources.map((resource, r_index) => (
                                                <li key={r_index}>
                                                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                        {resource.title}
                                                    </a>
                                                    <span className="ml-2 text-sm text-muted-foreground">({resource.type})</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <div className="mt-6 pt-4 border-t">
                                    <h4 className="mb-3 font-semibold">Your Progress</h4>
                                    <div className="flex items-center gap-4">
                                        {step.status === 'not-started' && (
                                            <Button onClick={() => handleUpdateStatus(index, 'in-progress')}>
                                                <Play className="w-4 h-4 mr-2" />
                                                Start Learning
                                            </Button>
                                        )}
                                        {step.status === 'in-progress' && (
                                            <Button onClick={() => handleUpdateStatus(index, 'completed')}>
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Mark as Complete
                                            </Button>
                                        )}
                                        {step.status === 'completed' && (
                                            <Button disabled variant="secondary" className="flex items-center gap-2 cursor-not-allowed">
                                                <CheckCircle className="w-4 h-4" />
                                                Completed
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
}
