import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import React from "react";
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
			message: "Nomor bab harus berupa angka",
		})
		.min(1, {
			message: "Nomor bab harus lebih dari 1",
		}),
	name: z
		.string({
			message: "Nama bab harus berupa teks",
		})
		.max(25, {
			message: "Nama bab tidak boleh lebih dari 25 karakter",
		}),
});

const BabForm: React.FC<{
	defaultValues?: z.infer<typeof FormSchema>;
	onSubmit: (data: z.infer<typeof FormSchema>) => void;
	loading: boolean;
}> = ({ onSubmit, defaultValues, loading }) => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues,
	});
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="number"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nomor bab</FormLabel>
							<FormControl>
								<Input
									type="number"
									placeholder="Isi dengan angka minimal 1"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Ini adalah nomor bab yang nanatinya akan digunakan untuk urutan
								bab
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
							<FormLabel>Nama bab</FormLabel>
							<FormControl>
								<Input
									type="text"
									placeholder="Isi dengan nama bab, maksimal 25 karakter"
									{...field}
								/>
							</FormControl>
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

export default BabForm;
