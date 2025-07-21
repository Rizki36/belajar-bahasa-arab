import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/common/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/common/components/ui/form";
import { Input } from "@/common/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/common/components/ui/select";
import { Textarea } from "@/common/components/ui/textarea";

export const FormSchema = z.object({
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

const LessonForm: React.FC<{
	defaultValues?: z.infer<typeof FormSchema>;
	onSubmit: (data: z.infer<typeof FormSchema>) => void;
	loading: boolean;
}> = ({ defaultValues, onSubmit, loading }) => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: defaultValues || {
			number: 1,
			contentType: "quiz",
		},
	});

	// Get current content type to manage conditional fields
	const contentType = form.watch("contentType");

	// Reset conditional fields when content type changes
	useEffect(() => {
		if (contentType === "quiz") {
			form.setValue("videoUrl", undefined);
			form.setValue("pdfUrl", undefined);
		} else if (contentType === "video") {
			form.setValue("pdfUrl", undefined);
		} else if (contentType === "pdf") {
			form.setValue("videoUrl", undefined);
			form.setValue("title", undefined);
			form.setValue("description", undefined);
		}
	}, [contentType, form]);

	const showTitleAndDescription = contentType !== "quiz";

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="number"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nomor</FormLabel>
							<FormControl>
								<Input
									type="number"
									placeholder="Isi dengan angka minimal 1"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Ini adalah nomor pelajaran yang nanatinya akan digunakan untuk
								urutan pelajaran
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="contentType"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Jenis Konten</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Pilih jenis konten" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="quiz">Kuis</SelectItem>
									<SelectItem value="video">Video</SelectItem>
									<SelectItem value="pdf">PDF</SelectItem>
									<SelectItem value="mixed">Campuran</SelectItem>
								</SelectContent>
							</Select>
							<FormDescription>
								Jenis konten yang akan ditampilkan pada pelajaran ini
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{showTitleAndDescription && (
					<>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Judul Pelajaran</FormLabel>
									<FormControl>
										<Input
											placeholder="Masukkan judul pelajaran"
											{...field}
											value={field.value || ""}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Deskripsi</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Deskripsi singkat pelajaran"
											className="resize-none"
											{...field}
											value={field.value || ""}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</>
				)}

				{(contentType === "video" || contentType === "mixed") && (
					<FormField
						control={form.control}
						name="videoUrl"
						render={({ field }) => (
							<FormItem>
								<FormLabel>URL Video YouTube</FormLabel>
								<FormControl>
									<Input
										placeholder="https://www.youtube.com/watch?v=..."
										{...field}
										value={field.value || ""}
									/>
								</FormControl>
								<FormDescription>
									Salin URL video YouTube yang ingin ditampilkan
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}

				{(contentType === "pdf" || contentType === "mixed") && (
					<FormField
						control={form.control}
						name="pdfUrl"
						render={({ field }) => (
							<FormItem>
								<FormLabel>URL PDF</FormLabel>
								<FormControl>
									<Input
										placeholder="https://contoh.com/materi.pdf"
										{...field}
										value={field.value || ""}
									/>
								</FormControl>
								<FormDescription>
									Masukkan URL file PDF yang dapat diakses publik
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}

				<Button type="submit" disabled={loading}>
					{loading ? (
						<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
					) : null}
					Submit
				</Button>
			</form>
		</Form>
	);
};

export default LessonForm;
