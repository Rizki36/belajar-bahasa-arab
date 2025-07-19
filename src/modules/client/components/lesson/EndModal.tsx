import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";

import { Button } from "@/common/components/ui/button";
import { Dialog, DialogContent } from "@/common/components/ui/dialog";
import { trpc } from "@/utils/trpc";

import useStudent from "../../hooks/useStudent";
import StarIcon from "../../icons/Star";

const EndModal: FC<{
	open: boolean;
	onOpenChange: (open: boolean) => void;
	score: number;
	star: number;
}> = ({ open, score, star, onOpenChange }) => {
	const router = useRouter();
	const { student } = useStudent();
	const { mutate: updateScore, isPending: updateScorePending } =
		trpc.student.self.updateScore.useMutation();
	const trpcUtils = trpc.useUtils();

	useEffect(() => {
		if (!open || !student?.id || !star) return;

		updateScore(
			{
				studentId: student.id,
			},
			{
				onSuccess: () => {
					trpcUtils.student.self.student.invalidate();
				},
			},
		);
	}, [open, star, student?.id]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				withCloseButton={false}
				className="border-4 border-primary !rounded-xl bg-primary md:w-[450px] w-[95%]"
			>
				<div className="flex items-center justify-center gap-x-3 mt-6 mb-2">
					<StarIcon filled={star >= 1} className="size-[60px]" />
					<StarIcon filled={star >= 2} className="size-[60px] -mt-5" />
					<StarIcon filled={star >= 3} className="size-[60px]" />
				</div>

				<div className="text-white text-center">
					<div className="text-5xl font-semibold">{score}</div>
					<div>Nilai</div>
				</div>
				<div className="flex gap-x-3">
					<Button
						variant="ghost"
						size="lg"
						className="!text-white hover:bg-transparent w-full mt-6"
						onClick={() => {
							window.location.reload();
						}}
						disabled={updateScorePending}
					>
						Ulangi
					</Button>
					<Button
						variant="outline"
						size="lg"
						className="w-full mt-6"
						onClick={() => {
							router.push("/belajar");
						}}
						disabled={updateScorePending}
					>
						{updateScorePending ? (
							<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
						) : null}
						Kembali
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default EndModal;
