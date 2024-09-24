import { z } from "zod";

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
        })
      ),
    })
  ),
});
