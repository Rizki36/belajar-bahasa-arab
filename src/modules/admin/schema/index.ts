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
