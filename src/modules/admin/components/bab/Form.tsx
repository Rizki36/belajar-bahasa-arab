import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
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
import { BabFormFormSchema, type BabFormFormValues } from "../../schema";

type BabFormProps = {
	defaultValues?: BabFormFormValues;
	onSubmit: (data: BabFormFormValues) => void;
	loading: boolean;
};

const BabForm = (props: BabFormProps) => {
	const { onSubmit, defaultValues, loading } = props;
	const form = useForm<BabFormFormValues>({
		resolver: zodResolver(BabFormFormSchema),
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
