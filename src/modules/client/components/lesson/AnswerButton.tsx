import { ReloadIcon } from "@radix-ui/react-icons";
import React, { FC } from "react";
import { useWatch } from "react-hook-form";
import Button3D from "@/common/components/ui/3d-button";
import { QuizLessonFormType } from "../../schema";

const AnswerButton: FC<{
	form: QuizLessonFormType;
	onContinue: () => void;
	loading: boolean;
}> = ({ onContinue, form, loading }) => {
	const answer = useWatch({
		control: form.control,
		name: "answer",
	});
	const isIncorrect = useWatch({
		control: form.control,
		name: "isIncorrect",
	});

	return (
		<>
			{isIncorrect ? (
				<>
					<Button3D
						type="button"
						variant="destructive"
						className="w-full"
						frontClassName="!py-8 text-lg font-semibold"
						onClick={() => {
							onContinue();
						}}
					>
						Lanjut
					</Button3D>
					<div className="text-white text-center mt-3">Jawaban Anda salah.</div>
				</>
			) : (
				<Button3D
					type="submit"
					variant="white"
					className="w-full"
					frontClassName="!py-8 text-lg font-semibold"
					disabled={!answer || loading}
				>
					{loading ? (
						<ReloadIcon className="mr-2 size-6 animate-spin" />
					) : (
						"Jawab"
					)}
				</Button3D>
			)}
		</>
	);
};

export default AnswerButton;
