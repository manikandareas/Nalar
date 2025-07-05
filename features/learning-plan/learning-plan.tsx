"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkPreview } from "@/components/ui/link-preview";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { BotMessageSquare, CheckCircle, Loader2, Play, Rocket } from "lucide-react";

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

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{learningPlan.title}</h1>
                <p className="mt-2 text-base text-muted-foreground max-w-2xl">{learningPlan.description}</p>
            </div>

            {/* Timeline */}
            <div className="relative border-l-2 border-border/50 ml-3 pl-6 py-4 space-y-10">
                {learningPlan.steps.map((step, index) => {
                    const isInProgress = step.status === 'in-progress';
                    const isCompleted = step.status === 'completed';

                    return (
                        <div key={index} className="relative">
                            {/* Timeline Dot */}
                            <div className={`absolute -left-[34px] top-1 w-4 h-4 rounded-full border-4 box-content
                                ${isCompleted ? 'bg-green-500 border-green-500/30' : ''}
                                ${isInProgress ? 'bg-blue-500 border-blue-500/30' : ''}
                                ${step.status === 'not-started' ? 'bg-muted-foreground/50 border-muted-foreground/20' : ''}
                            `}>
                                {isInProgress && <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping"></div>}
                            </div>

                            <div className="transition-all duration-300">
                                {/* Title and Badge */}
                                <div className="flex items-center justify-between">
                                    <h2 className={`text-xl font-semibold ${isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{step.title}</h2>
                                    <Badge variant={isCompleted ? 'default' : 'secondary'} className="text-xs font-medium">
                                        {step.status.replace("-", " ")}
                                    </Badge>
                                </div>

                                {/* Description */}
                                <p className="mt-1 text-muted-foreground text-sm">{step.description}</p>

                                {/* Resources */}
                                {step.resources && step.resources.length > 0 && (
                                    <div className="mt-4 p-4 rounded-lg bg-muted/50 border">
                                        <h4 className="mb-2 font-semibold text-xs uppercase text-muted-foreground tracking-wider">Suggested Resources</h4>
                                        <ul className="space-y-2">
                                            {step.resources.map((resource, r_index) => (
                                                <li key={r_index} className="flex items-center gap-2.5">
                                                    <Rocket className="w-4 h-4 text-primary/80 shrink-0" />
                                                    {/* <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline"> */}
                                                    <LinkPreview className="text-sm font-medium text-primary hover:underline" url={resource.url}>
                                                        {resource.title}
                                                    </LinkPreview>
                                                    {/* </a> */}
                                                    <span className="text-xs text-muted-foreground">({resource.type})</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="mt-4 flex items-center gap-2">
                                    <Button variant="outline" size="sm">
                                        Ask Nalar <BotMessageSquare className="w-4 h-4 ml-2" />
                                    </Button>
                                    {step.status === 'not-started' && (
                                        <Button onClick={() => handleUpdateStatus(index, 'in-progress')} size="sm" className="group">
                                            Start Step
                                            <Play className="w-4 h-4 ml-2 group-hover:fill-current" />
                                        </Button>
                                    )}
                                    {isInProgress && (
                                        <Button onClick={() => handleUpdateStatus(index, 'completed')} size="sm">
                                            Mark as Complete
                                            <CheckCircle className="w-4 h-4 ml-2" />
                                        </Button>
                                    )}
                                    {isCompleted && (
                                        <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                                            <CheckCircle className="w-4 h-4" />
                                            Completed
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
