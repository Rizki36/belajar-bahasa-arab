import z from "zod";

export const BabFormFormSchema = z.object({
	number: z.coerce
		.number({
			message: "Nomor bab harus berupa angka",
		})
		.min(1, {
			message: "Nomor bab minimal 1",
		}),
	name: z
		.string({
			message: "Nama bab harus berupa teks",
		})
		.max(25, {
			message: "Nama bab tidak boleh lebih dari 25 karakter",
		}),
});

export type BabFormFormValues = z.infer<typeof BabFormFormSchema>;

export const LessonFormSchema = z.object({
	number: z.coerce
		.number({
			message: "Nomor pelajaran harus berupa angka",
		})
		.min(0, {
			message: "Nomor pelajaran minimal 0",
		}),
	title: z.string().optional(),
	description: z.string().optional(),
	contentType: z.enum(["quiz", "video", "pdf", "mixed"]).default("quiz"),
	videoUrl: z
		.string()
		.url("URL video tidak valid")
		.optional()
		.refine(
			(val) => {
				// Skip validation if field is empty
				if (!val) return true;
				// Simple regex to validate YouTube URL
				return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/.test(val);
			},
			{
				message: "URL harus dari YouTube",
			},
		),
	pdfUrl: z.string().url("URL PDF tidak valid").optional(),
});

export type LessonFormValues = z.infer<typeof LessonFormSchema>;

export const QuestionFormSchema = z.object({
	items: z.array(
		z.object({
			id: z.string().uuid(),
			number: z.number().min(1),
			question: z
				.string({
					message: "Pertanyaan harus berupa teks",
				})
				.min(1, {
					message: "Pertanyaan tidak boleh kosong",
				}),
			answers: z.array(
				z.object({
					id: z.string().uuid(),
					number: z.number().min(1),
					text: z.string().min(1, {
						message: "Jawaban tidak boleh kosong",
					}),
					correct: z.boolean(),
				}),
			),
		}),
	),
});

export type QuestionFormValues = z.infer<typeof QuestionFormSchema>;
