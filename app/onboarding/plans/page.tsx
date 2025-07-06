"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { api } from "@/convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Control, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    learningGoals: z.array(z.string()).min(1, "Please select at least one learning goal."),
    studyReason: z.string().min(1, "Please select a reason for studying."),
    studyPlan: z.string(),
    level: z.enum(["beginner", "intermediate", "advanced"]),
});

type FormData = z.infer<typeof formSchema>;

const steps = [
    { id: 1, name: "What do you want to learn?", description: "This will help us tailor your learning experience. Be as specific or general as you like" },
    { id: 2, name: "Why are you learning this?", description: "Understanding your 'why' help us personalize your journey and keep you motivated." },
    { id: 3, name: "What level are you at?", description: "Help us understand your current knowledge level." },
    { id: 4, name: "How often do you plan to use Nalar?", description: "Undestanding your style help us make Nalar a better learning companion for you." },
];

export default function LearningGoalsPage() {
    const router = useRouter();
    const saveGoals = useMutation(api.users.mutations.saveLearningPlan);
    const generatePlan = useMutation(api.users.mutations.generateAndSaveLearningPlan);
    const [currentStep, setCurrentStep] = useState(0);
    const currentUser = useQuery(api.users.queries.getCurrentUser)

    console.log(currentUser);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            learningGoals: [],
            studyReason: "",
            studyPlan: "weekly",
            level: "beginner",
        },
    });

    async function onSubmit(values: FormData) {
        try {
            await saveGoals({
                learningGoals: values.learningGoals,
                studyReason: values.studyReason,
                studyPlan: values.studyPlan,
                level: values.level,
            });
            // This is a background job, so we don't need to await it.
            generatePlan({
                userId: currentUser!._id,
            });
            router.push("/rooms"); // Navigate to dashboard after completion
        } catch (error) {
            console.error("Failed to save learning goals:", error);
        }
    }

    const nextStep = () => setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    const prevStep = () => setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));

    return (
        <div className="flex items-center justify-center min-h-screen bg-background relative">
            <div className="w-full max-w-xl p-8 space-y-6 bg-card text-card-foreground rounded-lg shadow-lg">
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold">{steps[currentStep].name}</h1>
                    <p className="text-muted-foreground text-sm">{steps[currentStep].description}</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {currentStep === 0 && <LearningGoals control={form.control} />}
                        {currentStep === 1 && <StudyReason control={form.control} />}
                        {currentStep === 2 && <Level control={form.control} />}
                        {currentStep === 3 && <StudyPlan control={form.control} />}

                        <div className="flex justify-between">
                            {currentStep > 0 ? (
                                <Button type="button" variant="outline" onClick={prevStep}>
                                    Back
                                </Button>
                            ) : <span />}
                            {currentStep < steps.length - 1 && (
                                <Button type="button" onClick={nextStep}>
                                    Next
                                </Button>
                            )}
                            {currentStep === steps.length - 1 && (
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting ? "Saving..." : "Finish Setup"}
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
            </div>
            <Progress value={(currentStep + 1) * 25} className="w-full mt-4 absolute bottom-0 left-0 right-0 h-3" />
        </div>
    );
}

function LearningGoals({ control }: { control: Control<FormData> }) {
    const learningGoalOptions = [
        "Web Development",
        "Data Science",
        "Machine Learning",
        "Mobile Development",
        "Game Development",
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
        "Computer Science",
    ];

    return (
        <FormField
            control={control}
            name="learningGoals"
            render={({ field }) => (
                <FormItem className="space-y-2">
                    <FormLabel>Learning Goals</FormLabel>
                    <FormControl className="w-full">
                        <div className="w-full">
                            <Input readOnly className="mb-4" placeholder="e.g., Web Development, Machine Learning" value={field.value.join(", ")} />
                            <p className="text-muted-foreground text-xs mb-4">Popular choices</p>
                            <ToggleGroup
                                type="multiple"
                                variant={"outline"}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full"
                            >
                                {learningGoalOptions.map((option) => (
                                    <ToggleGroupItem key={option} value={option} className="px-4 py-2 justify-start">
                                        {option}
                                    </ToggleGroupItem>
                                ))}
                            </ToggleGroup>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

function StudyReason({ control }: { control: Control<FormData> }) {
    const motivationOptions = [
        { value: "academic", label: "Academic Success (School/University)" },
        { value: "test-preparation", label: "Test Preparation (SAT, GRE, GMAT, etc.)" },
        { value: "understanding-concept", label: "Understanding difficult concepts" },
        { value: "personal-growth", label: "Personal curiosity & growth" },
        { value: "career-preparation", label: "Career preparation & skill development" },
        { value: "other", label: "Other (Please specify)" },
    ]
    return (
        <FormField
            control={control}
            name="studyReason"
            render={({ field }) => (
                <FormItem className="space-y-2">
                    <FormLabel>Select your motivation</FormLabel>
                    <FormControl className="w-full">
                        <ToggleGroup type="single" onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 gap-4 w-full">
                            {motivationOptions.map((option) => (
                                <ToggleGroupItem className="justify-start px-4 py-2" variant={"outline"} value={option.value} key={option.value}>
                                    {option.label}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

function StudyPlan({ control }: { control: Control<FormData> }) {
    const studyPlanOptions = [
        { value: "quick-support", label: "Quick support & Clarifications", description: "I'll mainly use it when i have specific questions or need explanations." },
        { value: "focused-sessions", label: "Focused Learning Sessions", description: "I plan to use it for dedicated sessions when i want to dive deep into specific topics." },
        { value: "regular", label: "Regular Check-ins & Review", description: "I want to consistently review and reinforce what I learn through regular sessions and progress check-ins." },
        { value: "flexible", label: "Flexible All-Rounder", description: "I'll use it as needed for a mix of deep dives, quick questions, and ongoing support—whatever fits my schedule." }
    ]
    return (
        <FormField
            control={control}
            name="studyPlan"
            render={({ field }) => (
                <FormItem className="space-y-2">
                    <FormLabel>Choose your usage style</FormLabel>
                    <FormControl className="w-full">
                        <ToggleGroup type="single" onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 gap-4 w-full">
                            {studyPlanOptions.map((option) => (
                                <ToggleGroupItem variant={"outline"} className="justify-start py-2 flex flex-col items-start h-max flex-wrap overflow-hidden" value={option.value} key={option.value}>
                                    <span className="font-semibold"> {option.label}</span>
                                    <p className="text-xs text-muted-foreground text-wrap text-start">{option.description}</p>
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

function Level({ control }: { control: Control<FormData> }) {
    const levelOptions = [
        { value: "beginner", label: "I completly new to it", description: "Starting from scratch with little to no prior knowledge (pre-high school level)" },
        { value: "intermediate", label: "I have some basic understanding", description: "Familiar with fundamentals but need to build deeper knowledge (high school level)" },
        { value: "advanced", label: "I have a some experience/knowledge", description: "Looking to expand on existing skills and fill knowledge gaps (graduate/professional level)" },
    ]
    return (
        <FormField
            control={control}
            name="level"
            render={({ field }) => (
                <FormItem className="space-y-2">
                    <FormLabel>Select your current level?</FormLabel>
                    <FormControl className="w-full">
                        <ToggleGroup type="single" onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 gap-4 w-full">
                            {levelOptions.map((option) => (
                                <ToggleGroupItem variant={"outline"} className="justify-start py-2 flex flex-col items-start h-max flex-wrap overflow-hidden" value={option.value} key={option.value}>
                                    <span className="font-semibold"> {option.label}</span>
                                    <p className="text-xs text-muted-foreground text-wrap text-start">{option.description}</p>
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
