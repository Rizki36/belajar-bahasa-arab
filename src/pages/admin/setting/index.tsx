import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import Head from "next/head";
import type React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import GoogleDrivePdfViewer from "@/common/components/GoogleDrivePdfViewer";
import { Button } from "@/common/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/common/components/ui/collapsible";
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
import { Spinner } from "@/common/components/ui/spinner";
import { Switch } from "@/common/components/ui/switch";
import useSystemSetting from "@/common/hooks/useSystemSetting";
import AdminMainLayout from "@/modules/admin/layouts/MainLayout";
import type { NextPageWithLayout } from "@/pages/_app";
import { trpc } from "@/utils/trpc";

const FormSchema = z.object({
	randomizeQuestion: z.boolean().default(false),
	randomizeAnswer: z.boolean().default(false),
	defaultScore: z.coerce.number().default(15),
	adminManualBookUrl: z.string().default(""),
	studentManualBookUrl: z.string().default(""),
});

type SettingFormValues = z.infer<typeof FormSchema>;

const SettingPage: NextPageWithLayout = () => {
	const { error, config, loading } = useSystemSetting();

	if (loading) {
		return (
			<div className="w-full h-screen flex items-center justify-center">
				<Spinner size="large" />
			</div>
		);
	}

	if (error) return <div>{error.message}</div>;

	return (
		<>
			<Head>
				<title>Mudah belajar ilmu shorof</title>
			</Head>
			<div className="w-full">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-3xl font-semibold">Pengaturan</h1>
				</div>
				<SettingForm
					defaultValues={{
						randomizeQuestion: config.randomizeQuestion,
						randomizeAnswer: config.randomizeAnswer,
						defaultScore: config.defaultScore,
						adminManualBookUrl: config.adminManualBookUrl,
						studentManualBookUrl: config.studentManualBookUrl,
					}}
				/>
			</div>
		</>
	);
};

const SettingForm: React.FC<{
	defaultValues: SettingFormValues;
}> = ({ defaultValues }) => {
	const trpcUtils = trpc.useUtils();
	const { mutateAsync } = trpc.admin.setting.upsert.useMutation();
	const form = useForm<SettingFormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues,
	});

	const onSubmit = async (data: SettingFormValues) => {
		try {
			toast.success("Berhasil menyimpan pengaturan");
			await mutateAsync({
				items: [
					{
						name: "randomizeQuestion",
						value: data.randomizeQuestion.toString(),
					},
					{ name: "randomizeAnswer", value: data.randomizeAnswer.toString() },
					{ name: "defaultScore", value: data.defaultScore.toString() },
					{
						name: "adminManualBookUrl",
						value: data.adminManualBookUrl.toString(),
					},
					{
						name: "studentManualBookUrl",
						value: data.studentManualBookUrl.toString(),
					},
				],
			});
			trpcUtils.admin.setting.invalidate();
		} catch (error) {
			toast.error("Gagal menyimpan pengaturan");
			console.error(error);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-4 lg:w-1/2"
			>
				<FormField
					control={form.control}
					name="randomizeQuestion"
					render={({ field }) => (
						<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
							<div className="space-y-0.5">
								<FormLabel className="text-base">Acak pertanyaan</FormLabel>
								<FormDescription>
									Aktifkan fitur ini untuk mengacak pertanyaan
								</FormDescription>
							</div>
							<FormControl>
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="randomizeAnswer"
					render={({ field }) => (
						<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
							<div className="space-y-0.5">
								<FormLabel className="text-base">Acak jawaban</FormLabel>
								<FormDescription>
									Aktifkan fitur ini untuk mengacak jawaban
								</FormDescription>
							</div>
							<FormControl>
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="defaultScore"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nilai default</FormLabel>
							<FormControl>
								<Input
									type="number"
									placeholder="Isi dengan angka minimal 1"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Ini adalah nilai default yang akan diberikan kepada siswa jika
								berhasil menjawab soal
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="adminManualBookUrl"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Admin Manual Book URL{" "}
								{field.value && (
									<a
										href={field.value}
										target="_blank"
										rel="noreferrer"
										className="text-blue-500 hover:underline"
									>
										<ExternalLinkIcon className="inline-block w-4 h-4" />
									</a>
								)}
							</FormLabel>
							<FormControl>
								<Input
									type="text"
									placeholder="Isi dengan URL buku manual admin"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								URL ini akan digunakan untuk mengakses buku manual admin.
							</FormDescription>
							{field.value && (
								<Collapsible>
									<CollapsibleTrigger asChild>
										<Button variant="outline" size="sm" type="button">
											Preview PDF
										</Button>
									</CollapsibleTrigger>
									<CollapsibleContent className="mt-2">
										<GoogleDrivePdfViewer
											pdfUrl={field.value}
											title="Admin Manual Book PDF Preview"
										/>
									</CollapsibleContent>
								</Collapsible>
							)}
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="studentManualBookUrl"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Student Manual Book URL{" "}
								{field.value && (
									<a
										href={field.value}
										target="_blank"
										rel="noreferrer"
										className="text-blue-500 hover:underline"
									>
										<ExternalLinkIcon className="inline-block w-4 h-4" />
									</a>
								)}
							</FormLabel>
							<FormControl>
								<Input
									type="text"
									placeholder="Isi dengan URL buku manual siswa"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								URL ini akan digunakan untuk mengakses buku manual siswa.
							</FormDescription>
							{field.value && (
								<Collapsible>
									<CollapsibleTrigger asChild>
										<Button variant="outline" size="sm" type="button">
											Preview PDF
										</Button>
									</CollapsibleTrigger>
									<CollapsibleContent className="mt-2">
										<GoogleDrivePdfViewer
											pdfUrl={field.value}
											title="Student Manual Book PDF Preview"
										/>
									</CollapsibleContent>
								</Collapsible>
							)}
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="mt-4">
					<Button type="submit">Simpan</Button>
				</div>
			</form>
		</Form>
	);
};

SettingPage.getLayout = (page) => {
	return <AdminMainLayout>{page}</AdminMainLayout>;
};

export default SettingPage;
