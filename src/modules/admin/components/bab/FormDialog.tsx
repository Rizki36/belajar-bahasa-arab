import type { Bab } from "@prisma/client";
import { toast } from "sonner";
import type { TypeOf } from "zod";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/common/components/ui/dialog";
import { trpc } from "@/utils/trpc";

import BabForm, { type FormSchema } from "./Form";

type BabFormDialogProps = {
	mode: "create" | "update";
	open: boolean;
	setOpen: (open: boolean) => void;
	bab?: Bab;
};

const BabFormDialog = (props: BabFormDialogProps) => {
	const { mode, open, setOpen, bab } = props;
	const { mutateAsync: createBab, status: createStatus } =
		trpc.admin.bab.add.useMutation();
	const { mutateAsync: updateBab, status: updateStatus } =
		trpc.admin.bab.update.useMutation();
	const trpcUtils = trpc.useUtils();

	const loading = createStatus === "pending" || updateStatus === "pending";

	const handleCreate = async (data: TypeOf<typeof FormSchema>) => {
		try {
			await createBab(data);
			setOpen(false);
		} catch (error) {
			toast.error("Gagal menambah bab", {
				description: "Terjadi kesalahan saat menambah bab. Silahkan coba lagi.",
			});
			console.error(error);
		}
	};

	const handleUpdate = async (data: TypeOf<typeof FormSchema>) => {
		try {
			if (!bab?.id) throw new Error("Bab ID is missing");

			await updateBab({
				id: bab?.id,
				...data,
			});
			setOpen(false);
		} catch (error) {
			toast.error("Gagal mengubah bab", {
				description: "Terjadi kesalahan saat mengubah bab. Silahkan coba lagi.",
			});
			console.error(error);
		}
	};

	const handleSubmit = async (data: TypeOf<typeof FormSchema>) => {
		if (mode === "create") {
			await handleCreate(data);
		}
		if (mode === "update") {
			await handleUpdate(data);
		}

		trpcUtils.admin.bab.invalidate();
	};

	return (
		<Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
			<DialogContent className="max-w-[1000px]">
				<DialogHeader>
					<DialogTitle>{mode === "create" ? "Tambah" : "Edit"} Bab</DialogTitle>
					<DialogDescription></DialogDescription>
				</DialogHeader>
				<div>
					<BabForm
						defaultValues={
							bab
								? {
										name: bab?.name || "",
										number: bab?.number || 1,
									}
								: undefined
						}
						onSubmit={handleSubmit}
						loading={loading}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default BabFormDialog;
