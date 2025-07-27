import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { useRouter } from "next/router";
import { toast } from "sonner";

import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/common/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/common/components/ui/button";
import { trpc } from "@/utils/trpc";

const useDeleteBab = () => {
	const router = useRouter();
	const { mutateAsync: deleteBab } = trpc.admin.bab.delete.useMutation();
	const trpcUtils = trpc.useUtils();

	const handleDelete = async () => {
		const id = router.query.babId as string;
		try {
			if (!id) throw new Error("Bab ID is missing");
			await deleteBab({
				id,
			});
			toast.success("Berhasil menghapus bab", {
				description: "Bab berhasil dihapus",
			});
			await router.push("/admin/bab");
		} catch (error) {
			toast.error("Gagal menghapus bab", {
				description:
					"Terjadi kesalahan saat menghapus bab. Silahkan coba lagi.",
			});
			console.error(error);
		}
		trpcUtils.admin.bab.invalidate();
	};

	return { handleDelete };
};

type DeleteBabButtonProps = {};

const DeleteBabButton = (props: DeleteBabButtonProps) => {
	const {} = props;
	const { handleDelete } = useDeleteBab();

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button size="sm" variant="destructive">
					Hapus
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
					<AlertDialogDescription>
						Anda akan menghapus bab ini beserta seluruh sub bab dan pelajaran
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogPrimitive.Action
						className={buttonVariants({ variant: "ghost" })}
						onClick={handleDelete}
					>
						Yakin
					</AlertDialogPrimitive.Action>

					<AlertDialogPrimitive.Cancel
						className={buttonVariants({ variant: "default" })}
					>
						Batal
					</AlertDialogPrimitive.Cancel>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteBabButton;
