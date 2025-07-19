import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useSession } from "next-auth/react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/common/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/common/components/ui/form";
import { Input } from "@/common/components/ui/input";
import { trpc } from "@/utils/trpc";

export const FormSchema = z.object({
	name: z
		.string({
			message: "Nama harus berupa teks",
		})
		.max(25, {
			message: "Nama tidak boleh lebih dari 25 karakter",
		}),
});

type FormValues = z.infer<typeof FormSchema>;

const SettingForm: React.FC<{
	defaultValues?: FormValues;
	onSubmit: (data: FormValues) => void;
	loading: boolean;
}> = ({ onSubmit, defaultValues, loading }) => {
	const { data } = useSession();

	const form = useForm<FormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues,
	});

	return (
		<div className="flex flex-1 items-center md:items-stretch flex-col md:flex-row gap-x-3">
			<Image
				src={data?.user.image ?? ""}
				width={64}
				height={64}
				className="size-24 md:size-16 mt-2 rounded-full bg-neutral-300"
				alt="Profile"
			/>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6 w-[250px]"
				>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nama</FormLabel>
								<FormControl>
									<Input
										type="text"
										placeholder="Isi dengan nama, maksimal 25 karakter"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" disabled={loading} className="mx-auto">
						{loading ? (
							<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
						) : null}
						Update
					</Button>
				</form>
			</Form>
		</div>
	);
};

const Wrapper = () => {
	const { mutateAsync, status: updateStatus } =
		trpc.student.self.updateSetting.useMutation();
	const { data: sessionData, update: updateSession } = useSession();
	const trpcUtils = trpc.useUtils();

	const loading = updateStatus === "pending";

	const onSubmit = async (data: FormValues) => {
		try {
			await mutateAsync({
				name: data.name,
			});

			await updateSession({
				...sessionData,
				user: {
					...(sessionData?.user ?? {}),
					name: data.name,
				},
			});

			await trpcUtils.student.self.invalidate();

			toast.success("Berhasil mengupdate data");
		} catch (error) {
			console.error(error);
			toast.error("Gagal mengupdate data", {
				description:
					"Terjadi kesalahan saat mengupdate data. Silahkan coba lagi.",
			});
		}
	};

	return (
		<SettingForm
			onSubmit={onSubmit}
			defaultValues={{
				name: sessionData?.user.name ?? "",
			}}
			loading={loading}
		/>
	);
};

export default Wrapper;
