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

const useDeleteSubBab = () => {
	const router = useRouter();
	const { mutateAsync: deleteSubBab } = trpc.admin.subBab.delete.useMutation();
	const trpcUtils = trpc.useUtils();

	const handleDelete = async () => {
		const id = router.query.subBabId as string;
		try {
			if (!id) throw new Error("Sub Bab ID is missing");

			// Get the sub bab data to check for babId
			const subBab = await trpcUtils.admin.subBab.list.fetch({
				id,
				with: ["bab"],
			});

			// Delete the sub bab
			await deleteSubBab({
				id,
			});

			toast.success("Berhasil menghapus sub bab", {
				description: "Sub bab berhasil dihapus",
			});

			// Navigation logic after successful deletion
			const babId = subBab?.items?.[0]?.bab?.id;

			if (babId) {
				// If we have the babId from the sub bab data, navigate to it
				await router.push(`/admin/bab/${babId}`);
			} else {
				// If no babId, go back to the previous page
				router.back();

				// As a fallback, if router.back() doesn't work as expected
				// (for example in a new tab), we'll add a timeout to redirect to /admin/bab
				setTimeout(() => {
					// Check if we're still on the same page after attempting router.back()
					if (router.asPath.includes(`/admin/sub-bab/${id}`)) {
						router.push("/admin/bab");
					}
				}, 100);
			}
		} catch (error) {
			toast.error("Gagal menghapus sub bab", {
				description:
					"Terjadi kesalahan saat menghapus sub bab. Silahkan coba lagi.",
			});
			console.error(error);
		}
		trpcUtils.admin.subBab.invalidate();
	};

	return { handleDelete };
};

const DeleteSubBabButton: React.FC = () => {
	const { handleDelete } = useDeleteSubBab();

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
						Anda akan menghapus sub bab ini beserta seluruh pelajaran
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

export default DeleteSubBabButton;
