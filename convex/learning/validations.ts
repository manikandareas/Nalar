import { z } from "zod";

export const learningPlanStepSchema = z.object({
    title: z.string().describe("A concise title for this step of the learning plan."),
    description: z.string().describe("A detailed description of what this step entails and what the user will learn."),
    status: z.enum(["not-started", "in-progress", "completed"]).describe("The current status of this learning step."),
    resources: z.optional(z.array(z.object({
        title: z.string().describe("The title of the resource."),
        url: z.string().url().describe("A URL to the resource."),
        type: z.string().describe("The type of resource (e.g., 'Article', 'Video', 'Interactive Tutorial')."),
    }))).describe("A list of optional resources to help with this learning step."),
});

export const learningPlanSchema = z.object({
    title: z.string().describe("A high-level title for the entire learning plan."),
    description: z.string().describe("A brief overview of what the user will achieve with this learning plan."),
    steps: z.array(learningPlanStepSchema).describe("The sequence of steps that make up the learning plan."),
});
