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

const useDeleteLesson = () => {
	const router = useRouter();
	const { mutateAsync: deleteLesson } = trpc.admin.lesson.delete.useMutation();
	const trpcUtils = trpc.useUtils();

	const handleDelete = async () => {
		const id = router.query.lessonId as string;
		try {
			if (!id) throw new Error("Lesson ID is missing");
			await deleteLesson({
				id,
			});
			toast.success("Berhasil menghapus pelajaran", {
				description: "Pelajaran berhasil dihapus",
			});
			// Navigate back to the sub-bab page that contained this lesson
			const subBabId = router.query.subBabId as string;
			if (subBabId) {
				await router.push(`/admin/sub-bab/${subBabId}`);
			} else {
				// If no subBabId in the query, try to get it from the referrer or go to bab list
				await router.push("/admin/bab");
			}
		} catch (error) {
			toast.error("Gagal menghapus pelajaran", {
				description:
					"Terjadi kesalahan saat menghapus pelajaran. Silahkan coba lagi.",
			});
			console.error(error);
		}
		trpcUtils.admin.lesson.invalidate();
	};

	return { handleDelete };
};

const DeleteLessonButton: React.FC = () => {
	const { handleDelete } = useDeleteLesson();

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
						Anda akan menghapus pelajaran ini beserta seluruh soal
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

export default DeleteLessonButton;
