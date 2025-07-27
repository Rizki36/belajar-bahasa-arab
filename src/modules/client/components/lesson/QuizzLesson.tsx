import { HeartFilledIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Button } from "@/common/components/ui/button";
import { Form } from "@/common/components/ui/form";
import { Progress } from "@/common/components/ui/progress";
import { Spinner } from "@/common/components/ui/spinner";
import ShareSection from "@/modules/client/components/belajar/ShareSection";
import EndModal from "@/modules/client/components/lesson/EndModal";
import useQuizLesson from "@/modules/client/hooks/useQuizLesson";
import type { RouterOutput } from "@/utils/trpc";
import AnswerButton from "./AnswerButton";
import AnswerOption from "./AnswerOption";

type LessonData = RouterOutput["student"]["lesson"]["data"];

type QuizLessonProps = {
	lesson: LessonData["lesson"] | undefined;
	bab: LessonData["bab"] | undefined;
	subBab: LessonData["subBab"] | undefined;
};

const QuizLesson = (props: QuizLessonProps) => {
	const { lesson, bab, subBab } = props;

	const {
		score,
		star,
		isEnd,
		questionIndex,
		heartCount,
		questions,
		questionText,
		answers,
		isLoading,
		isSubmitting,
		form,
		onSubmit,
		handleContinue,
		handleModalOpenChange,
	} = useQuizLesson({ lesson, bab, subBab });

	if (isLoading)
		return (
			<div className="h-screen flex justify-center items-center">
				<Spinner size="large" />
			</div>
		);

	if (!bab || !subBab || !lesson) return null;

	return (
		<>
			<EndModal
				score={score}
				star={star}
				open={isEnd}
				onOpenChange={handleModalOpenChange}
			/>
			<div className="bg-primary min-h-screen px-4 md:px-11">
				<div className="pt-6 sticky top-0 flex items-center justify-between md:mb-2">
					<Link href="/belajar">
						<Button variant="ghost" className="text-white">
							Keluar
						</Button>
					</Link>
					<div className="flex items-center text-white gap-x-2 text-lg">
						{heartCount} <HeartFilledIcon className="text-white size-6" />
					</div>
				</div>
				<div className="grid gap-y-5 xl:grid-cols-[700px,1fr] gap-x-12 pb-6">
					<div className="flex sticky bg-primary top-0 pt-3 md:pt-0 z-50 flex-col-reverse xl:flex-col">
						<div className="bg-white py-6 xl:pb-0 rounded-xl">
							<div className="flex select-none p-8 text-xl font-semibold items-center justify-center w-full mix-h-[200px] xl:min-h-[400px] text-center mb-3">
								{questionText}
							</div>
							<ShareSection
								url={window?.location?.href ?? ""}
								variant="ghost"
								className="border-none hidden xl:flex"
							/>
						</div>
						<div className="group flex-col-reverse xl:flex-col items-center flex justify-center lg:mt-3 lg:mb-0 mt-0 mb-3">
							<Progress
								value={(questionIndex / questions.length) * 100}
								variant="white"
								className="w-full transition duration-300 group-hover:opacity-100 opacity-50 mb-2"
							/>
							<div className="flex justify-between w-full transition duration-300 text-white/50 group-hover:text-white">
								<div>
									Bab {bab.number}{" "}
									{subBab.name ? `- Unit ${subBab.number}` : `: ${bab.name}`}
								</div>
								<div>
									{questionIndex + 1} dari {questions.length} soal
								</div>
							</div>
						</div>
					</div>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<div className="space-y-6">
								{answers.map((answer) => (
									<AnswerOption
										key={answer.id}
										answer={answer}
										form={form}
										loading={isSubmitting}
									/>
								))}
							</div>
							<hr className="my-5" />
							<div>
								<AnswerButton
									form={form}
									onContinue={handleContinue}
									loading={isSubmitting}
								/>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</>
	);
};

export default QuizLesson;
