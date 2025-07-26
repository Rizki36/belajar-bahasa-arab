import { useId } from "react";
import { useWatch } from "react-hook-form";
import { cn } from "@/common/utils";
import type { RouterOutput } from "@/utils/trpc";
import type { QuizLessonFormType } from "../../schema";

type Questions = RouterOutput["student"]["lesson"]["listQuestion"]["questions"];

type AnswerOptionProps = {
	answer: Questions[number]["answer"][number];
	form: QuizLessonFormType;
	loading: boolean;
};

const AnswerOption = (props: AnswerOptionProps) => {
	const { answer, form, loading } = props;

	const id = useId();
	const isIncorrect = useWatch({
		control: form.control,
		name: "isIncorrect",
	});

	return (
		<div className="relative">
			<input
				{...form.register("answer")}
				type="radio"
				className="peer hidden"
				id={id}
				value={answer?.id}
				disabled={isIncorrect || loading}
			/>
			<label
				htmlFor={id}
				className={cn(
					"flex select-none text-xl text-white text-center font-semibold transition duration-200 bg-primary shadow-lg items-center justify-center cursor-pointer min-h-24 flex-col rounded-lg border-2 border-white p-4 hover:shadow-lg",
					"peer-checked:border-2 peer-checked:bg-white peer-checked:text-black peer-disabled:cursor-not-allowed",
				)}
			>
				{answer?.answer ?? ""}
			</label>
		</div>
	);
};

export default AnswerOption;
