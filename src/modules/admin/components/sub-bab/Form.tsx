import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
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

export const FormSchema = z.object({
	number: z.coerce
		.number({
			message: "Nomor sub bab harus berupa angka",
		})
		.min(1, {
			message: "Nomor sub bab minimal 1",
		}),
	name: z
		.string({
			message: "Nama sub bab harus berupa teks",
		})
		.max(25, {
			message: "Nama sub bab tidak boleh lebih dari 25 karakter",
		})
		.optional(),
});

type SubBabFormProps = {
	defaultValues?: z.infer<typeof FormSchema>;
	onSubmit: (data: z.infer<typeof FormSchema>) => void;
	loading: boolean;
};

const SubBabForm = (props: SubBabFormProps) => {
	const { defaultValues, onSubmit, loading } = props;
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues,
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				{/* TODO: cek uniq bab number */}
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
								Ini adalah nomor sub bab yang nanatinya akan digunakan untuk
								urutan sub bab
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nama sub bab</FormLabel>
							<FormControl>
								<Input
									type="text"
									placeholder="Isi dengan nama sub bab, maksimal 25 karakter"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Kosongi jika tidak ingin ada sub bab
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
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

export default SubBabForm;
