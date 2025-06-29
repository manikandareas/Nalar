import { z } from "zod";

/**
 * Schema for creating a new quiz
 * Defines the structure and validation for quiz creation
 */
export const createQuizSchema = z.object({
    title: z.string()
        .min(5, "Title must be at least 5 characters")
        .max(100, "Title cannot exceed 100 characters")
        .describe("A clear, concise title that summarizes the quiz content"),

    description: z.string()
        .max(500, "Description cannot exceed 500 characters")
        .optional()
        .describe("Detailed explanation of what the quiz covers and its purpose"),

    topic: z.string()
        .min(3, "Topic must be at least 3 characters")
        .describe("The main subject or theme of the quiz"),

    difficulty: z.enum(["easy", "medium", "hard"])
        .describe("The target difficulty level of the quiz"),
});

/**
* Schema for individual quiz questions
* Defines the structure and validation for each question
*/
export const questionSchema = z.object({
    questionNumber: z.number()
        .int()
        .positive()
        .describe("The sequential number of the question (1-based index)"),

    question: z.string()
        .min(10, "Question must be at least 10 characters")
        .describe("The actual question text"),

    options: z.array(z.string().min(1, "Option cannot be empty"))
        .min(2, "At least 2 options are required")
        .max(6, "Maximum 6 options allowed")
        .describe("Array of possible answers"),

    correctOptionIndex: z.number()
        .int()
        .nonnegative()
        .describe("Zero-based index of the correct answer in the options array"),

    explanation: z.string()
        .min(10, "Explanation must be at least 10 characters")
        .describe("Clear explanation of why the correct answer is right"),

    type: z.enum(["multiple_choice", "true_false"])
        .describe("The format of the question"),

    difficulty: z.enum(["easy", "medium", "hard"])
        .describe("The difficulty level of this specific question"),
});


/**
 * Schema for the complete quiz including metadata and questions
 */
export const quizSchema = z.object({
    questions: z.array(questionSchema)
        .min(1, "At least one question is required")
        .max(20, "Maximum 20 questions allowed")
        .describe("Collection of questions for the quiz"),
});