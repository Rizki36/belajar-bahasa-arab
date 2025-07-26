import type { UseFormReturn } from "react-hook-form";
import z from "zod";

export const QuizLessonFormSchema = z.object({
	answer: z.string(),
	isIncorrect: z.boolean().optional(),
});

export type QuizLessonFormType = UseFormReturn<
	z.infer<typeof QuizLessonFormSchema>
>;
