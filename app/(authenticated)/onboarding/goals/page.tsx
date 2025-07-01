"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const learningGoalSchema = z.object({
    topic: z.string().min(2, "Topic must be at least 2 characters."),
    level: z.enum(["beginner", "intermediate", "advanced"]),
});

const formSchema = z.object({
    learningGoals: z.array(learningGoalSchema).min(1, "Please add at least one learning goal."),
});

export default function LearningGoalsPage() {
    const router = useRouter();
    const saveGoals = useMutation(api.users.mutations.saveLearningGoals);
    const generatePlan = useMutation(api.users.mutations.generateAndSaveLearningPlan);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            learningGoals: [{ topic: "", level: "beginner" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "learningGoals",
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await saveGoals({ learningGoals: values.learningGoals });
            // This is a background job, so we don't need to await it.
            generatePlan();
            router.push("/"); // Navigate to dashboard after completion
        } catch (error) {
            console.error("Failed to save learning goals:", error);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="w-full max-w-2xl p-8 space-y-6 bg-card text-card-foreground rounded-lg shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">What do you want to learn?</h1>
                    <p className="text-muted-foreground">Tell us your learning goals to personalize your experience.</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex items-end gap-4 p-4 mb-4 border rounded-lg">
                                    <FormField
                                        control={form.control}
                                        name={`learningGoals.${index}.topic`}
                                        render={({ field }) => (
                                            <FormItem className="flex-grow">
                                                <FormLabel>Topic</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., Calculus" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`learningGoals.${index}.level`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Current Level</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select level" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="beginner">Beginner</SelectItem>
                                                        <SelectItem value="intermediate">Intermediate</SelectItem>
                                                        <SelectItem value="advanced">Advanced</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                                        Remove
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Button type="button" variant="outline" onClick={() => append({ topic: "", level: "beginner" })}>
                            Add Another Goal
                        </Button>
                        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? "Saving..." : "Finish Setup"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
