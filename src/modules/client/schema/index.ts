import type { UseFormReturn } from "react-hook-form";
import z from "zod";

export const QuizLessonFormSchema = z.object({
	answer: z.string(),
	isIncorrect: z.boolean().optional(),
});

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type QuizLessonFormType = any;
